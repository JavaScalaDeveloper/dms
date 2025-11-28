package com.arelore.dmsserver.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MyMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        // 创建时间和修改时间字段填充（新增时填充）
        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());
        this.strictInsertFill(metaObject, "modifyTime", LocalDateTime.class, LocalDateTime.now());
        
        // 创建人和修改人字段填充（这里设置默认值，实际项目中可以从登录用户信息中获取）
        this.strictInsertFill(metaObject, "creator", String.class, "system");
        this.strictInsertFill(metaObject, "modifier", String.class, "system");
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        // 修改时间字段填充（更新时填充）
        this.strictUpdateFill(metaObject, "modifyTime", LocalDateTime.class, LocalDateTime.now());
        
        // 修改人字段填充（这里设置默认值，实际项目中可以从登录用户信息中获取）
        this.strictUpdateFill(metaObject, "modifier", String.class, "system");
    }
}