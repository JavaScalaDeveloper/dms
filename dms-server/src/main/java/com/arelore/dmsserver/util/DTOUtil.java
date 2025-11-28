package com.arelore.dmsserver.util;

import com.arelore.dmsserver.dto.MysqlDatabaseDTO;
import com.arelore.dmsserver.dto.MysqlInstanceDTO;
import com.arelore.dmsserver.dto.MysqlTableInfoDTO;
import com.arelore.dmsserver.dto.SchemaDesignWorkOrderDTO;
import com.arelore.dmsserver.entity.MysqlDatabase;
import com.arelore.dmsserver.entity.MysqlInstance;
import com.arelore.dmsserver.entity.MysqlTableInfo;
import com.arelore.dmsserver.entity.SchemaDesignWorkOrder;

public class DTOUtil {
    
    // MysqlInstance转换
    public static MysqlInstanceDTO toDTO(MysqlInstance entity) {
        if (entity == null) {
            return null;
        }
        MysqlInstanceDTO dto = new MysqlInstanceDTO();
        dto.setId(entity.getId());
        dto.setCreateTime(entity.getCreateTime());
        dto.setModifyTime(entity.getModifyTime());
        dto.setCreator(entity.getCreator());
        dto.setModifier(entity.getModifier());
        dto.setName(entity.getName());
        dto.setHost(entity.getHost());
        dto.setPort(entity.getPort());
        dto.setStatus(entity.getStatus());
        dto.setEnv(entity.getEnv());
        return dto;
    }
    
    public static MysqlInstance toEntity(MysqlInstanceDTO dto) {
        if (dto == null) {
            return null;
        }
        MysqlInstance entity = new MysqlInstance();
        entity.setId(dto.getId());
        entity.setCreateTime(dto.getCreateTime());
        entity.setModifyTime(dto.getModifyTime());
        entity.setCreator(dto.getCreator());
        entity.setModifier(dto.getModifier());
        entity.setName(dto.getName());
        entity.setHost(dto.getHost());
        entity.setPort(dto.getPort());
        entity.setStatus(dto.getStatus());
        entity.setEnv(dto.getEnv());
        return entity;
    }
    
    // MysqlDatabase转换
    public static MysqlDatabaseDTO toDTO(MysqlDatabase entity) {
        if (entity == null) {
            return null;
        }
        MysqlDatabaseDTO dto = new MysqlDatabaseDTO();
        dto.setId(entity.getId());
        dto.setCreateTime(entity.getCreateTime());
        dto.setModifyTime(entity.getModifyTime());
        dto.setCreator(entity.getCreator());
        dto.setModifier(entity.getModifier());
        dto.setName(entity.getName());
        dto.setInstanceHost(entity.getInstanceHost());
        dto.setSize(entity.getSize());
        dto.setTableCount(entity.getTableCount());
        return dto;
    }
    
    public static MysqlDatabase toEntity(MysqlDatabaseDTO dto) {
        if (dto == null) {
            return null;
        }
        MysqlDatabase entity = new MysqlDatabase();
        entity.setId(dto.getId());
        entity.setCreateTime(dto.getCreateTime());
        entity.setModifyTime(dto.getModifyTime());
        entity.setCreator(dto.getCreator());
        entity.setModifier(dto.getModifier());
        entity.setName(dto.getName());
        entity.setInstanceHost(dto.getInstanceHost());
        entity.setSize(dto.getSize());
        entity.setTableCount(dto.getTableCount());
        return entity;
    }
    
    // MysqlTableInfo转换
    public static MysqlTableInfoDTO toDTO(MysqlTableInfo entity) {
        if (entity == null) {
            return null;
        }
        MysqlTableInfoDTO dto = new MysqlTableInfoDTO();
        dto.setId(entity.getId());
        dto.setCreateTime(entity.getCreateTime());
        dto.setModifyTime(entity.getModifyTime());
        dto.setCreator(entity.getCreator());
        dto.setModifier(entity.getModifier());
        dto.setName(entity.getName());
        dto.setDbName(entity.getDbName());
        dto.setInstanceHost(entity.getInstanceHost());
        dto.setRowCount(entity.getRowCount());
        dto.setSize(entity.getSize());
        return dto;
    }
    
    public static MysqlTableInfo toEntity(MysqlTableInfoDTO dto) {
        if (dto == null) {
            return null;
        }
        MysqlTableInfo entity = new MysqlTableInfo();
        entity.setId(dto.getId());
        entity.setCreateTime(dto.getCreateTime());
        entity.setModifyTime(dto.getModifyTime());
        entity.setCreator(dto.getCreator());
        entity.setModifier(dto.getModifier());
        entity.setName(dto.getName());
        entity.setDbName(dto.getDbName());
        entity.setInstanceHost(dto.getInstanceHost());
        entity.setRowCount(dto.getRowCount());
        entity.setSize(dto.getSize());
        return entity;
    }

    // SchemaDesignWorkOrder转换
    public static SchemaDesignWorkOrderDTO toDTO(SchemaDesignWorkOrder entity) {
        if (entity == null) {
            return null;
        }
        SchemaDesignWorkOrderDTO dto = new SchemaDesignWorkOrderDTO();
        dto.setId(entity.getId());
        dto.setCreateTime(entity.getCreateTime());
        dto.setModifyTime(entity.getModifyTime());
        dto.setCreator(entity.getCreator());
        dto.setModifier(entity.getModifier());
        dto.setProjectName(entity.getProjectName());
        dto.setDatabaseType(entity.getDatabaseType());
        dto.setChangeBaseline(entity.getChangeBaseline());
        dto.setRelatedPerson(entity.getRelatedPerson());
        dto.setProjectBackground(entity.getProjectBackground());
        dto.setStatus(entity.getStatus());
        return dto;
    }

    public static SchemaDesignWorkOrder toEntity(SchemaDesignWorkOrderDTO dto) {
        if (dto == null) {
            return null;
        }
        SchemaDesignWorkOrder entity = new SchemaDesignWorkOrder();
        entity.setId(dto.getId());
        entity.setCreateTime(dto.getCreateTime());
        entity.setModifyTime(dto.getModifyTime());
        entity.setCreator(dto.getCreator());
        entity.setModifier(dto.getModifier());
        entity.setProjectName(dto.getProjectName());
        entity.setDatabaseType(dto.getDatabaseType());
        entity.setChangeBaseline(dto.getChangeBaseline());
        entity.setRelatedPerson(dto.getRelatedPerson());
        entity.setProjectBackground(dto.getProjectBackground());
        entity.setStatus(dto.getStatus());
        return entity;
    }
}