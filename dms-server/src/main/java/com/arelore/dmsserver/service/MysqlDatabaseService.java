package com.arelore.dmsserver.service;

import com.arelore.dmsserver.entity.MysqlDatabase;
import com.arelore.dmsserver.entity.MysqlInstance;
import com.arelore.dmsserver.dto.MysqlDatabaseDTO;
import com.baomidou.mybatisplus.extension.service.IService;

import java.sql.SQLException;
import java.util.List;

public interface MysqlDatabaseService extends IService<MysqlDatabase> {
    /**
     * 创建数据库
     * @param databaseDTO 数据库信息
     * @param instance 实例信息
     * @return 创建结果
     * @throws SQLException SQL异常
     */
    MysqlDatabase createDatabase(MysqlDatabaseDTO databaseDTO, MysqlInstance instance) throws SQLException;
    
    /**
     * 根据实例主机地址获取数据库列表
     * @param instanceHost 实例主机地址
     * @return 数据库列表
     */
    List<MysqlDatabase> listByInstanceHost(String instanceHost);
    
    /**
     * 根据实例主机地址获取数据库DTO列表
     * @param instanceHost 实例主机地址
     * @return 数据库DTO列表
     */
    List<MysqlDatabaseDTO> listDTOsByInstanceHost(String instanceHost);
    
    /**
     * 获取所有数据库DTO列表
     * @return 数据库DTO列表
     */
    List<MysqlDatabaseDTO> getAllDatabaseDTOs();
    
    /**
     * 根据ID获取数据库DTO
     * @param id 数据库ID
     * @return 数据库DTO
     */
    MysqlDatabaseDTO getDatabaseDTOById(Long id);
}