import os
import glob

replacements = [
    # role checks
    ('session.user.role === "user"', 'session.user.role === "tendik"'),
    ('session?.user?.role === "user"', 'session?.user?.role === "tendik"'),
    ('session.user.role === \'user\'', 'session.user.role === \'tendik\''),
    ('role === "user"', 'role === "tendik"'),
    ('role === \'user\'', 'role === \'tendik\''),
    ('role: "user"', 'role: "tendik"'),
    
    ('session.user.role === "admin_keuangan"', 'session.user.role === "keuangan"'),
    ('session?.user?.role === "admin_keuangan"', 'session?.user?.role === "keuangan"'),
    ('session.user.role === \'admin_keuangan\'', 'session.user.role === \'keuangan\''),
    ('role === "admin_keuangan"', 'role === "keuangan"'),
    ('role === \'admin_keuangan\'', 'role === \'keuangan\''),
    ('role: "admin_keuangan"', 'role: "keuangan"'),

    # Array checks
    ('["admin_keuangan", "wk2_keuangan"].includes(session.user.role)', 'session.user.role === "keuangan"'),
    ('["admin_keuangan", "wk2_keuangan"].includes(session?.user?.role)', 'session?.user?.role === "keuangan"'),
    ('["admin_keuangan", "wk2_keuangan"].includes(role as string)', 'role === "keuangan"'),
    
    ('["user", "admin_keuangan", "wk2_keuangan", "ketua"]', '["tendik", "keuangan", "ketua"]'),
    ('["user", "Tendik"].includes(session?.user?.role)', 'session?.user?.role === "tendik"'),
    ('["Keuangan", "admin_keuangan", "wk2_keuangan", "admin", "ketua"].includes(session?.user?.role)', '["keuangan", "ketua"].includes(session?.user?.role)'),
    ('["Keuangan", "admin_keuangan", "admin", "ketua"].includes(session.user.role)', '["keuangan", "ketua"].includes(session.user.role)'),
    
    # Logs
    ('tujuanCatatan: \'admin_keuangan\'', 'tujuanCatatan: \'keuangan\''),
    ('tujuanCatatan === \'admin_keuangan\'', 'tujuanCatatan === \'keuangan\''),
    ('tujuanCatatan: \'user\'', 'tujuanCatatan: \'tendik\''),
    ('tujuanCatatan === \'user\'', 'tujuanCatatan === \'tendik\''),

    # Other isolated
    ('roleName = session?.user?.role === "keuangan" ? "Admin" : session?.user?.role === "ketua" ? "Ketua" : "User"', 'roleName = session?.user?.role === "keuangan" ? "Keuangan" : session?.user?.role === "ketua" ? "Ketua" : "Tendik"'),
    ('userRole = session?.user?.role || "user"', 'userRole = session?.user?.role || "tendik"')
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for old, new in replacements:
        content = content.replace(old, new)
        
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            process_file(os.path.join(root, file))

