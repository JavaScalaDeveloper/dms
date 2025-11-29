package com.arelore.dmsserver.service.impl;

import com.arelore.dmsserver.entity.SchemaDesignWorkOrder;
import com.arelore.dmsserver.mapper.SchemaDesignWorkOrderMapper;
import com.arelore.dmsserver.service.SchemaDesignWorkOrderService;
import com.arelore.dmsserver.dto.SchemaDesignWorkOrderDTO;
import com.arelore.dmsserver.util.DTOUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchemaDesignWorkOrderServiceImpl extends ServiceImpl<SchemaDesignWorkOrderMapper, SchemaDesignWorkOrder> implements SchemaDesignWorkOrderService {
    
    @Override
    public SchemaDesignWorkOrder createWorkOrder(SchemaDesignWorkOrderDTO requestDTO) {
        if (!StringUtils.hasText(requestDTO.getProjectName())
                || !StringUtils.hasText(requestDTO.getDatabaseType())
                || !StringUtils.hasText(requestDTO.getChangeBaseline())
                || !StringUtils.hasText(requestDTO.getProjectBackground())) {
            throw new IllegalArgumentException("工单信息不完整");
        }

        SchemaDesignWorkOrder workOrder = DTOUtil.toEntity(requestDTO);
        if (!StringUtils.hasText(workOrder.getStatus())) {
            workOrder.setStatus("created");
        }

        this.save(workOrder);
        return workOrder;
    }
    
    @Override
    public List<SchemaDesignWorkOrder> getAllWorkOrders() {
        return this.list();
    }
    
    @Override
    public List<SchemaDesignWorkOrderDTO> getAllWorkOrderDTOs() {
        List<SchemaDesignWorkOrder> workOrders = this.list();
        return workOrders.stream().map(DTOUtil::toDTO).collect(Collectors.toList());
    }
    
    private String generateWorkOrderNo() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        return "WO" + LocalDateTime.now().format(formatter);
    }
}