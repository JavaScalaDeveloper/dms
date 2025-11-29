package com.arelore.dmsserver.controller;

import com.arelore.dmsserver.common.ApiResponse;
import com.arelore.dmsserver.dto.TableStructureDesignDTO;
import com.arelore.dmsserver.dto.WorkOrderIdRequestDTO;
import com.arelore.dmsserver.entity.TableStructureDesign;
import com.arelore.dmsserver.service.TableStructureDesignService;
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
            TableStructureDesign result = tableStructureDesignService.saveTableStructureDesign(tableStructureDesignDTO);
            return ApiResponse.success("保存成功", tableStructureDesignService.getTableStructureDesignDTOById(result.getId()));
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
            
            TableStructureDesign tableStructureDesign = tableStructureDesignService.getByWorkOrderId(workOrderId);
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
            List<TableStructureDesignDTO> tableStructureDesignList = tableStructureDesignService.listDTOsByWorkOrderId(workOrderId);
            return ApiResponse.success(tableStructureDesignList);
        } catch (Exception e) {
            return ApiResponse.error("查询失败: " + e.getMessage());
        }
    }
}