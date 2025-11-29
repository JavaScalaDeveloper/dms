package com.arelore.dmsserver.service;

import com.arelore.dmsserver.entity.SchemaDesignWorkOrder;
import com.arelore.dmsserver.dto.SchemaDesignWorkOrderDTO;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

public interface SchemaDesignWorkOrderService extends IService<SchemaDesignWorkOrder> {
    /**
     * 创建工单
     * @param requestDTO 工单信息
     * @return 创建的工单
     */
    SchemaDesignWorkOrder createWorkOrder(SchemaDesignWorkOrderDTO requestDTO);
    
    /**
     * 获取所有工单
     * @return 工单列表
     */
    List<SchemaDesignWorkOrder> getAllWorkOrders();
    
    /**
     * 获取所有工单DTO列表
     * @return 工单DTO列表
     */
    List<SchemaDesignWorkOrderDTO> getAllWorkOrderDTOs();
}