-- Honeycomb ERP Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Roles & Permissions
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 2. Users (Extends Supabase Auth)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    role_id UUID REFERENCES roles(id),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Master Data: Warehouses
CREATE TABLE warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    location TEXT,
    capacity DECIMAL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Master Data: Categories
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('material', 'product', 'sparepart')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Products & Materials
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id),
    unit TEXT NOT NULL, -- kg, pcs, roll, etc
    type TEXT CHECK (type IN ('raw_material', 'semi_finished', 'finished_good', 'sparepart')) NOT NULL,
    min_stock DECIMAL DEFAULT 0,
    max_stock DECIMAL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Inventory: Stock
CREATE TABLE stocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    warehouse_id UUID REFERENCES warehouses(id) ON DELETE CASCADE,
    quantity DECIMAL NOT NULL DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(item_id, warehouse_id)
);

-- 7. Inventory: Movements
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES items(id),
    warehouse_id UUID REFERENCES warehouses(id),
    type TEXT CHECK (type IN ('inbound', 'outbound', 'transfer', 'adjustment')) NOT NULL,
    quantity DECIMAL NOT NULL,
    reference_id UUID, -- PO ID, Work Order ID, etc
    reference_type TEXT,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Suppliers
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    contact_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Purchasing: Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_number TEXT UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    status TEXT CHECK (status IN ('draft', 'pending', 'approved', 'received', 'cancelled')) DEFAULT 'draft',
    total_amount DECIMAL DEFAULT 0,
    order_date DATE DEFAULT CURRENT_DATE,
    expected_arrival DATE,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id),
    quantity DECIMAL NOT NULL,
    unit_price DECIMAL NOT NULL,
    received_quantity DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Production: BOM
CREATE TABLE boms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    finished_good_id UUID REFERENCES items(id),
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bom_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bom_id UUID REFERENCES boms(id) ON DELETE CASCADE,
    material_id UUID REFERENCES items(id),
    quantity DECIMAL NOT NULL, -- Amount needed for 1 unit of FG
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Production: Machines
CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    type TEXT,
    status TEXT CHECK (status IN ('running', 'idle', 'maintenance', 'breakdown')) DEFAULT 'idle',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Production: Work Orders
CREATE TABLE work_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wo_number TEXT UNIQUE NOT NULL,
    bom_id UUID REFERENCES boms(id),
    machine_id UUID REFERENCES machines(id),
    target_quantity DECIMAL NOT NULL,
    produced_quantity DECIMAL DEFAULT 0,
    reject_quantity DECIMAL DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT CHECK (status IN ('planned', 'in_progress', 'completed', 'cancelled')) DEFAULT 'planned',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Maintenance Logs
CREATE TABLE maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id UUID REFERENCES machines(id),
    type TEXT CHECK (type IN ('preventive', 'corrective')) NOT NULL,
    description TEXT,
    technician_name TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    costs DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Quality Control
CREATE TABLE qc_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_order_id UUID REFERENCES work_orders(id),
    check_type TEXT NOT NULL,
    status TEXT CHECK (status IN ('pass', 'fail')) NOT NULL,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) - Simplified for starting
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- Audit Logic (Update Timestamps)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_warehouses_updated_at BEFORE UPDATE ON warehouses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
