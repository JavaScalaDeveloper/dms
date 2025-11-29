package com.arelore.dmsserver.service;

import com.arelore.dmsserver.entity.TableStructureDesign;
import com.arelore.dmsserver.dto.TableStructureDesignDTO;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface TableStructureDesignService extends IService<TableStructureDesign> {
    /**
     * 保存表结构设计
     * @param tableStructureDesignDTO 表结构设计数据传输对象
     * @return 保存结果
     */
    TableStructureDesign saveTableStructureDesign(TableStructureDesignDTO tableStructureDesignDTO);
    
    /**
     * 根据工单ID获取表结构设计
     * @param workOrderId 工单ID
     * @return 表结构设计
     */
    TableStructureDesign getByWorkOrderId(Long workOrderId);
    
    /**
     * 根据工单ID获取所有表结构设计
     * @param workOrderId 工单ID
     * @return 表结构设计列表
     */
    List<TableStructureDesign> listByWorkOrderId(Long workOrderId);
    
    /**
     * 根据工单ID获取所有表结构设计DTO列表
     * @param workOrderId 工单ID
     * @return 表结构设计DTO列表
     */
    List<TableStructureDesignDTO> listDTOsByWorkOrderId(Long workOrderId);
    
    /**
     * 根据ID获取表结构设计DTO
     * @param id 表结构设计ID
     * @return 表结构设计DTO
     */
    TableStructureDesignDTO getTableStructureDesignDTOById(Long id);
}