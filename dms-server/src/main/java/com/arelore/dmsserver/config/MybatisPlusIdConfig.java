package com.arelore.dmsserver.config;

import com.baomidou.mybatisplus.core.incrementer.IdentifierGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.atomic.AtomicLong;

/**
 * 自定义 MyBatis-Plus 主键生成器，避免默认实现获取网卡信息导致在受限环境中启动失败。
 * 实际业务中建议替换为数据库自增或分布式ID方案。
 */
@Configuration
public class MybatisPlusIdConfig {

    private final AtomicLong counter = new AtomicLong(1);

    @Bean
    public IdentifierGenerator customIdentifierGenerator() {
        return new IdentifierGenerator() {
            @Override
            public Number nextId(Object entity) {
                return counter.getAndIncrement();
            }
        };
    }
}


