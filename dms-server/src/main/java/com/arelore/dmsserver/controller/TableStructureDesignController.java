package com.arelore.dmsserver.controller;

import com.arelore.dmsserver.common.ApiResponse;
import com.arelore.dmsserver.dto.TableStructureDesignDTO;
import com.arelore.dmsserver.dto.WorkOrderIdRequestDTO;
import com.arelore.dmsserver.entity.TableStructureDesign;
import com.arelore.dmsserver.service.TableStructureDesignService;
import com.arelore.dmsserver.util.DTOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/table-structure-design-detail")
public class TableStructureDesignController {
    
    @Autowired
    private TableStructureDesignService tableStructureDesignService;
    
    /**
     * 保存表结构设计
     * @param tableStructureDesignDTO 表结构设计数据传输对象
     * @return ApiResponse
     */
    @PostMapping("/save")
    public ApiResponse saveTableStructureDesign(@RequestBody TableStructureDesignDTO tableStructureDesignDTO) {
        try {
            TableStructureDesign tableStructureDesign = DTOUtil.toEntity(tableStructureDesignDTO);
            
            // 根据工单ID和表名判断记录是否存在
            TableStructureDesign existingRecord = tableStructureDesignService.lambdaQuery()
                    .eq(TableStructureDesign::getWorkOrderId, tableStructureDesign.getWorkOrderId())
                    .eq(TableStructureDesign::getTableName, tableStructureDesign.getTableName())
                    .one();
            
            if (existingRecord != null) {
                // 如果记录存在，则更新
                tableStructureDesign.setId(existingRecord.getId());
                // 版本号自增
                tableStructureDesign.setCurrentVersion(existingRecord.getCurrentVersion() + 1);
                tableStructureDesignService.updateById(tableStructureDesign);
            } else {
                // 如果记录不存在，则新增
                tableStructureDesign.setCurrentVersion(1);
                tableStructureDesignService.save(tableStructureDesign);
            }
            
            return ApiResponse.success("保存成功");
        } catch (Exception e) {
            return ApiResponse.error("保存失败: " + e.getMessage());
        }
    }
    
    /**
     * 根据工单ID获取表结构设计
     * @param request 包含工单ID的请求对象
     * @return ApiResponse
     */
    @PostMapping("/get-by-work-order")
    public ApiResponse getByWorkOrderId(@RequestBody WorkOrderIdRequestDTO request) {
        try {
            Long workOrderId = request.getWorkOrderId();
            if (workOrderId == null) {
                return ApiResponse.error("工单ID不能为空");
            }
            
            // 获取该工单下的所有表结构设计，返回最新创建的一个
            TableStructureDesign tableStructureDesign = tableStructureDesignService.lambdaQuery()
                    .eq(TableStructureDesign::getWorkOrderId, workOrderId)
                    .orderByDesc(TableStructureDesign::getCreateTime)
                    .last("LIMIT 1")
                    .one();
            return ApiResponse.success(tableStructureDesign);
        } catch (Exception e) {
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
    
    /**
     * 根据工单ID获取所有表结构设计
     * @param workOrderId 工单ID
     * @return ApiResponse
     */
    @GetMapping("/list-by-work-order")
    public ApiResponse listByWorkOrderId(@RequestParam Long workOrderId) {
        try {
            List<TableStructureDesign> tableStructureDesignList = tableStructureDesignService.lambdaQuery()
                    .eq(TableStructureDesign::getWorkOrderId, workOrderId)
                    .list();
            return ApiResponse.success(tableStructureDesignList);
        } catch (Exception e) {
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
}