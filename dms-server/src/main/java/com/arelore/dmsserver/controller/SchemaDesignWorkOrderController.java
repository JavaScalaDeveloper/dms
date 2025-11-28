package com.arelore.dmsserver.controller;

import com.arelore.dmsserver.common.ApiResponse;
import com.arelore.dmsserver.dto.SchemaDesignWorkOrderDTO;
import com.arelore.dmsserver.entity.SchemaDesignWorkOrder;
import com.arelore.dmsserver.service.SchemaDesignWorkOrderService;
import com.arelore.dmsserver.util.DTOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/schema/work-orders")
public class SchemaDesignWorkOrderController {

    @Autowired
    private SchemaDesignWorkOrderService workOrderService;

    @PostMapping("/create")
    public ApiResponse<SchemaDesignWorkOrderDTO> createWorkOrder(@RequestBody SchemaDesignWorkOrderDTO requestDTO) {
        if (!StringUtils.hasText(requestDTO.getProjectName())
                || !StringUtils.hasText(requestDTO.getDatabaseType())
                || !StringUtils.hasText(requestDTO.getChangeBaseline())
                || !StringUtils.hasText(requestDTO.getProjectBackground())) {
            return ApiResponse.error("工单信息不完整");
        }

        SchemaDesignWorkOrder workOrder = DTOUtil.toEntity(requestDTO);
        if (!StringUtils.hasText(workOrder.getStatus())) {
            workOrder.setStatus("created");
        }

        workOrderService.save(workOrder);
        return ApiResponse.success("工单创建成功", DTOUtil.toDTO(workOrder));
    }

    private String generateWorkOrderNo() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        return "WO" + LocalDateTime.now().format(formatter);
    }
    
    @PostMapping("/list")
    public ApiResponse<List<SchemaDesignWorkOrderDTO>> getWorkOrders() {
        List<SchemaDesignWorkOrder> workOrders = workOrderService.list();
        List<SchemaDesignWorkOrderDTO> dtoList = workOrders.stream()
                .map(DTOUtil::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.success("获取结构设计列表成功", dtoList);
    }
}

