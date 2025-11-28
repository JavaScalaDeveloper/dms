-- 更新mysql_table_info表结构
-- 删除旧的database_id列（如果存在）
SET @column_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() 
                      AND TABLE_NAME = 'mysql_table_info' 
                      AND COLUMN_NAME = 'database_id');

SET @sql := IF(@column_exists > 0, 
               'ALTER TABLE mysql_table_info DROP COLUMN database_id', 
               'SELECT ''Column does not exist''');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 添加新的列（如果不存在）
SET @column_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() 
                      AND TABLE_NAME = 'mysql_table_info' 
                      AND COLUMN_NAME = 'db_name');

SET @sql := IF(@column_exists = 0, 
               'ALTER TABLE mysql_table_info ADD COLUMN db_name VARCHAR(255) NOT NULL DEFAULT '''' COMMENT ''所属数据库名''', 
               'SELECT ''Column already exists''');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 添加instance_host列（如果不存在）
SET @column_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
                      WHERE TABLE_SCHEMA = DATABASE() 
                      AND TABLE_NAME = 'mysql_table_info' 
                      AND COLUMN_NAME = 'instance_host');

SET @sql := IF(@column_exists = 0, 
               'ALTER TABLE mysql_table_info ADD COLUMN instance_host VARCHAR(255) NOT NULL DEFAULT '''' COMMENT ''所属实例地址''', 
               'SELECT ''Column already exists''');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 删除旧的索引（如果存在）
SET @index_exists := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
                     WHERE TABLE_SCHEMA = DATABASE() 
                     AND TABLE_NAME = 'mysql_table_info' 
                     AND INDEX_NAME = 'uk_instance_host_db_name_name');

SET @sql := IF(@index_exists > 0, 
               'ALTER TABLE mysql_table_info DROP INDEX uk_instance_host_db_name_name', 
               'SELECT ''Index does not exist''');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 添加唯一索引
ALTER TABLE mysql_table_info ADD UNIQUE INDEX uk_instance_host_db_name_name (instance_host, db_name, name);