package com.arelore.dmsserver.service;

import com.arelore.dmsserver.entity.MysqlInstance;
import com.arelore.dmsserver.dto.MysqlInstanceDTO;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface MysqlInstanceService extends IService<MysqlInstance> {
    /**
     * 根据主机地址获取MySQL实例
     * @param host 主机地址
     * @return MySQL实例
     */
    MysqlInstance getByHost(String host);
    
    /**
     * 获取所有MySQL实例DTO列表
     * @return MySQL实例DTO列表
     */
    List<MysqlInstanceDTO> getAllInstanceDTOs();
    
    /**
     * 根据ID获取MySQL实例DTO
     * @param id 实例ID
     * @return MySQL实例DTO
     */
    MysqlInstanceDTO getInstanceDTOById(Long id);
}