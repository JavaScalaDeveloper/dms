package com.arelore.dmsserver.controller;

import com.arelore.dmsserver.common.ApiResponse;
import com.arelore.dmsserver.dto.IdRequestDTO;
import com.arelore.dmsserver.dto.MysqlInstanceDTO;
import com.arelore.dmsserver.entity.MysqlInstance;
import com.arelore.dmsserver.service.MysqlInstanceService;
import com.arelore.dmsserver.util.DTOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mysql/instances")
public class MysqlInstanceController {
    
    @Autowired
    private MysqlInstanceService mysqlInstanceService;
    
    /**
     * 获取所有MySQL实例
     */
    @PostMapping("/list")
    public ApiResponse<List<MysqlInstanceDTO>> getAllInstances() {
        List<MysqlInstanceDTO> instances = mysqlInstanceService.list().stream()
                .map(DTOUtil::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.success(instances);
    }
    
    /**
     * 根据ID获取MySQL实例
     */
    @PostMapping("/get")
    public ApiResponse<MysqlInstanceDTO> getInstanceById(@RequestBody IdRequestDTO request) {
        MysqlInstance instance = mysqlInstanceService.getById(request.getId());
        return ApiResponse.success(DTOUtil.toDTO(instance));
    }
    
    /**
     * 创建MySQL实例
     */
    @PostMapping("/create")
    public ApiResponse<MysqlInstanceDTO> createInstance(@RequestBody MysqlInstanceDTO instanceDTO) {
        MysqlInstance instance = DTOUtil.toEntity(instanceDTO);
        mysqlInstanceService.save(instance);
        return ApiResponse.success("创建成功", DTOUtil.toDTO(instance));
    }
    
    /**
     * 更新MySQL实例
     */
    @PostMapping("/update")
    public ApiResponse<MysqlInstanceDTO> updateInstance(@RequestBody MysqlInstanceDTO instanceDTO) {
        MysqlInstance instance = DTOUtil.toEntity(instanceDTO);
        mysqlInstanceService.updateById(instance);
        return ApiResponse.success("更新成功", DTOUtil.toDTO(mysqlInstanceService.getById(instance.getId())));
    }
    
    /**
     * 删除MySQL实例
     */
    @PostMapping("/delete")
    public ApiResponse<Void> deleteInstance(@RequestBody IdRequestDTO request) {
        mysqlInstanceService.removeById(request.getId());
        return ApiResponse.success("删除成功", null);
    }
}