package com.arelore.dmsserver.service;

import com.arelore.dmsserver.entity.MysqlTableInfo;
import com.arelore.dmsserver.dto.MysqlTableInfoDTO;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface MysqlTableInfoService extends IService<MysqlTableInfo> {
    /**
     * 根据数据库ID获取表信息列表
     * @param databaseId 数据库ID
     * @return 表信息列表
     */
    List<MysqlTableInfo> listByDatabaseId(Long databaseId);
    
    /**
     * 根据数据库ID获取表信息DTO列表
     * @param databaseId 数据库ID
     * @return 表信息DTO列表
     */
    List<MysqlTableInfoDTO> listDTOsByDatabaseId(Long databaseId);
    
    /**
     * 获取所有表信息DTO列表
     * @return 表信息DTO列表
     */
    List<MysqlTableInfoDTO> getAllTableInfoDTOs();
    
    /**
     * 根据ID获取表信息DTO
     * @param id 表信息ID
     * @return 表信息DTO
     */
    MysqlTableInfoDTO getTableInfoDTOById(Long id);
}