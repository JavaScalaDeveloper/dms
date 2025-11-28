package com.arelore.dmsserver.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

@Component
public class DatabaseMigrationConfig implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // 执行数据库迁移脚本
        executeSqlScript("db/migration.sql");
    }

    private void executeSqlScript(String scriptPath) throws Exception {
        ClassPathResource resource = new ClassPathResource(scriptPath);
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder sqlBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                // 跳过注释行和空行
                if (line.trim().isEmpty() || line.trim().startsWith("--")) {
                    continue;
                }
                sqlBuilder.append(line).append("\n");
            }

            // 分割并执行SQL语句
            String[] sqlStatements = sqlBuilder.toString().split(";");
            for (String sql : sqlStatements) {
                if (!sql.trim().isEmpty()) {
                    try {
                        jdbcTemplate.execute(sql.trim());
                        System.out.println("执行SQL成功: " + sql.trim().substring(0, Math.min(50, sql.trim().length())) + "...");
                    } catch (Exception e) {
                        System.err.println("执行SQL失败: " + sql.trim().substring(0, Math.min(50, sql.trim().length())) + "...");
                        System.err.println("错误信息: " + e.getMessage());
                        // 继续执行其他语句
                    }
                }
            }
        }
    }
}