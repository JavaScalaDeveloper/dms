package com.arelore.dmsserver.controller;

import com.arelore.dmsserver.common.ApiResponse;
import com.arelore.dmsserver.dto.DatabaseIdRequestDTO;
import com.arelore.dmsserver.dto.IdRequestDTO;
import com.arelore.dmsserver.dto.MysqlTableInfoDTO;
import com.arelore.dmsserver.entity.MysqlDatabase;
import com.arelore.dmsserver.entity.MysqlTableInfo;
import com.arelore.dmsserver.service.MysqlDatabaseService;
import com.arelore.dmsserver.service.MysqlTableInfoService;
import com.arelore.dmsserver.util.DTOUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mysql/tables")
public class MysqlTableInfoController {
    
    @Autowired
    private MysqlTableInfoService mysqlTableInfoService;
    
    @Autowired
    private MysqlDatabaseService mysqlDatabaseService;
    
    /**
     * 获取所有MySQL表信息
     */
    @PostMapping("/list")
    public ApiResponse<List<MysqlTableInfoDTO>> getAllTables() {
        List<MysqlTableInfoDTO> tables = mysqlTableInfoService.list().stream()
                .map(DTOUtil::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.success(tables);
    }
    
    /**
     * 根据ID获取MySQL表信息
     */
    @PostMapping("/get")
    public ApiResponse<MysqlTableInfoDTO> getTableById(@RequestBody IdRequestDTO request) {
        MysqlTableInfo table = mysqlTableInfoService.getById(request.getId());
        return ApiResponse.success(DTOUtil.toDTO(table));
    }
    
    /**
     * 根据数据库ID获取MySQL表信息列表
     */
    @PostMapping("/listByDatabaseId")
    public ApiResponse<List<MysqlTableInfoDTO>> getTablesByDatabaseId(@RequestBody DatabaseIdRequestDTO request) {
        List<MysqlTableInfoDTO> tables = mysqlTableInfoService.list(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<MysqlTableInfo>()
                        .eq("database_id", request.getDatabaseId())
        ).stream().map(DTOUtil::toDTO).collect(Collectors.toList());
        return ApiResponse.success(tables);
    }
    
    /**
     * 创建MySQL表信息
     */
    @PostMapping("/create")
    public ApiResponse<MysqlTableInfoDTO> createTable(@RequestBody MysqlTableInfoDTO tableDTO) {
        MysqlTableInfo table = DTOUtil.toEntity(tableDTO);
        mysqlTableInfoService.save(table);
        return ApiResponse.success("创建成功", DTOUtil.toDTO(table));
    }
    
    /**
     * 更新MySQL表信息
     */
    @PostMapping("/update")
    public ApiResponse<MysqlTableInfoDTO> updateTable(@RequestBody MysqlTableInfoDTO tableDTO) {
        MysqlTableInfo table = DTOUtil.toEntity(tableDTO);
        mysqlTableInfoService.updateById(table);
        return ApiResponse.success("更新成功", DTOUtil.toDTO(mysqlTableInfoService.getById(table.getId())));
    }
    
    /**
     * 删除MySQL表信息
     */
    @PostMapping("/delete")
    public ApiResponse<Void> deleteTable(@RequestBody IdRequestDTO request) {
        mysqlTableInfoService.removeById(request.getId());
        return ApiResponse.success("删除成功", null);
    }
}