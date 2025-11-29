package com.arelore.dmsserver.controller;

import com.arelore.dmsserver.common.ApiResponse;
import com.arelore.dmsserver.dto.SchemaDesignWorkOrderDTO;
import com.arelore.dmsserver.entity.SchemaDesignWorkOrder;
import com.arelore.dmsserver.service.SchemaDesignWorkOrderService;
import com.arelore.dmsserver.util.DTOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/schema/work-orders")
public class SchemaDesignWorkOrderController {

    @Autowired
    private SchemaDesignWorkOrderService workOrderService;

    @PostMapping("/create")
    public ApiResponse<SchemaDesignWorkOrderDTO> createWorkOrder(@RequestBody SchemaDesignWorkOrderDTO requestDTO) {
        try {
            SchemaDesignWorkOrder workOrder = workOrderService.createWorkOrder(requestDTO);
            return ApiResponse.success("工单创建成功", DTOUtil.toDTO(workOrder));
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("工单创建失败: " + e.getMessage());
        }
    }
    
    @PostMapping("/list")
    public ApiResponse<List<SchemaDesignWorkOrderDTO>> getWorkOrders() {
        List<SchemaDesignWorkOrderDTO> workOrders = workOrderService.getAllWorkOrderDTOs();
        return ApiResponse.success("获取结构设计列表成功", workOrders);
    }
}