package com.arelore.dmsserver.util;

import com.arelore.dmsserver.entity.MysqlInstance;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

@Component
public class DatabaseConnectionUtil {

    /**
     * 连接到MySQL实例
     *
     * @param instance MySQL实例信息
     * @return 数据库连接
     * @throws SQLException 连接异常
     */
    public Connection connectToInstance(MysqlInstance instance) throws SQLException {
        String url = "jdbc:mysql://" + instance.getHost() + ":" + instance.getPort() + 
                     "?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8";
        return DriverManager.getConnection(url, "root", "123456"); // 这里使用默认的root用户和密码，实际项目中应该从配置中获取
    }

    /**
     * 在指定实例上创建数据库
     *
     * @param connection 数据库连接
     * @param databaseName 数据库名称
     * @throws SQLException 执行异常
     */
    public void createDatabase(Connection connection, String databaseName) throws SQLException {
        try (Statement statement = connection.createStatement()) {
            String sql = "CREATE DATABASE IF NOT EXISTS `" + databaseName + "`";
            statement.executeUpdate(sql);
        }
    }

    /**
     * 检查数据库是否已存在
     *
     * @param connection 数据库连接
     * @param databaseName 数据库名称
     * @return 是否存在
     * @throws SQLException 执行异常
     */
    public boolean databaseExists(Connection connection, String databaseName) throws SQLException {
        try (Statement statement = connection.createStatement()) {
            String sql = "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = '" + databaseName + "'";
            return statement.executeQuery(sql).next();
        }
    }
}