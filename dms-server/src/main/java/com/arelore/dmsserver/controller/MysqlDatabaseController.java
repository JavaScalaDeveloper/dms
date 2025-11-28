package com.arelore.dmsserver.controller;

import com.arelore.dmsserver.common.ApiResponse;
import com.arelore.dmsserver.dto.DatabaseIdRequestDTO;
import com.arelore.dmsserver.dto.IdRequestDTO;
import com.arelore.dmsserver.dto.InstanceIdRequestDTO;
import com.arelore.dmsserver.dto.MysqlDatabaseDTO;
import com.arelore.dmsserver.entity.MysqlDatabase;
import com.arelore.dmsserver.entity.MysqlInstance;
import com.arelore.dmsserver.service.MysqlDatabaseService;
import com.arelore.dmsserver.service.MysqlInstanceService;
import com.arelore.dmsserver.util.DTOUtil;
import com.arelore.dmsserver.util.DatabaseConnectionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mysql/databases")
public class MysqlDatabaseController {
    
    @Autowired
    private MysqlDatabaseService mysqlDatabaseService;
    
    @Autowired
    private MysqlInstanceService mysqlInstanceService;
    
    @Autowired
    private DatabaseConnectionUtil databaseConnectionUtil;
    
    /**
     * 获取所有MySQL数据库
     */
    @PostMapping("/list")
    public ApiResponse<List<MysqlDatabaseDTO>> getAllDatabases() {
        List<MysqlDatabaseDTO> databases = mysqlDatabaseService.list().stream()
                .map(DTOUtil::toDTO)
                .collect(Collectors.toList());
        return ApiResponse.success(databases);
    }
    
    /**
     * 根据ID获取MySQL数据库
     */
    @PostMapping("/get")
    public ApiResponse<MysqlDatabaseDTO> getDatabaseById(@RequestBody IdRequestDTO request) {
        MysqlDatabase database = mysqlDatabaseService.getById(request.getId());
        return ApiResponse.success(DTOUtil.toDTO(database));
    }
    
    /**
     * 根据实例地址获取MySQL数据库列表
     */
    @PostMapping("/listByInstanceHost")
    public ApiResponse<List<MysqlDatabaseDTO>> getDatabasesByInstanceHost(@RequestBody InstanceIdRequestDTO request) {
        List<MysqlDatabaseDTO> databases = mysqlDatabaseService.list(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<MysqlDatabase>()
                        .eq("instance_host", request.getInstanceId())
        ).stream().map(DTOUtil::toDTO).collect(Collectors.toList());
        return ApiResponse.success(databases);
    }
    
    /**
     * 创建MySQL数据库
     */
    @PostMapping("/create")
    public ApiResponse<MysqlDatabaseDTO> createDatabase(@RequestBody MysqlDatabaseDTO databaseDTO) {
        try {
            // 检查数据库是否已存在于我们的记录中
            List<MysqlDatabase> existingDatabases = mysqlDatabaseService.list(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<MysqlDatabase>()
                    .eq("instance_host", databaseDTO.getInstanceHost())
                    .eq("name", databaseDTO.getName())
            );
            
            if (!existingDatabases.isEmpty()) {
                return ApiResponse.error("数据库已存在");
            }
            
            // 获取实例信息
            MysqlInstance instance = mysqlInstanceService.getOne(
                new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<MysqlInstance>()
                    .eq("host", databaseDTO.getInstanceHost())
            );
            
            if (instance == null) {
                return ApiResponse.error("找不到对应的MySQL实例");
            }
            
            // 连接到实例并检查数据库是否真的存在
            try (Connection connection = databaseConnectionUtil.connectToInstance(instance)) {
                if (databaseConnectionUtil.databaseExists(connection, databaseDTO.getName())) {
                    // 如果数据库在实际MySQL中存在但在我们的记录中不存在，则只添加记录
                    MysqlDatabase database = DTOUtil.toEntity(databaseDTO);
                    mysqlDatabaseService.save(database);
                    return ApiResponse.success("数据库记录添加成功", DTOUtil.toDTO(database));
                } else {
                    // 如果数据库在实际MySQL中不存在，则创建它
                    databaseConnectionUtil.createDatabase(connection, databaseDTO.getName());
                    
                    // 保存到我们的记录中
                    MysqlDatabase database = DTOUtil.toEntity(databaseDTO);
                    mysqlDatabaseService.save(database);
                    return ApiResponse.success("数据库创建成功", DTOUtil.toDTO(database));
                }
            }
        } catch (SQLException e) {
            return ApiResponse.error("数据库操作失败: " + e.getMessage());
        } catch (Exception e) {
            return ApiResponse.error("创建数据库失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新MySQL数据库
     */
    @PostMapping("/update")
    public ApiResponse<MysqlDatabaseDTO> updateDatabase(@RequestBody MysqlDatabaseDTO databaseDTO) {
        MysqlDatabase database = DTOUtil.toEntity(databaseDTO);
        mysqlDatabaseService.updateById(database);
        return ApiResponse.success("更新成功", DTOUtil.toDTO(mysqlDatabaseService.getById(database.getId())));
    }
    
    /**
     * 删除MySQL数据库
     */
    @PostMapping("/delete")
    public ApiResponse<Void> deleteDatabase(@RequestBody IdRequestDTO request) {
        mysqlDatabaseService.removeById(request.getId());
        return ApiResponse.success("删除成功", null);
    }
}