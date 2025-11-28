-- 插入示例MySQL实例数据
INSERT INTO mysql_instance_info (name, host, port, status, env, creator, modifier) VALUES
('生产MySQL实例1', '192.168.1.10', 3306, 'running', 'prd', 'admin', 'admin'),
('测试MySQL实例2', '192.168.1.11', 3306, 'stopped', 'test', 'admin', 'admin');

-- 插入示例MySQL数据库数据
INSERT INTO mysql_database_info (name, instance_host, size, table_count, creator, modifier) VALUES
('production_db', '192.168.1.10', '10GB', 25, 'admin', 'admin'),
('test_db', '192.168.1.11', '2GB', 8, 'admin', 'admin');

-- 插入示例MySQL表数据
INSERT INTO mysql_table_info (name, db_name, instance_host, row_count, size, creator, modifier) VALUES
('users', 'production_db', '192.168.1.10', 10000, '5MB', 'admin', 'admin'),
('orders', 'production_db', '192.168.1.10', 50000, '15MB', 'admin', 'admin');
