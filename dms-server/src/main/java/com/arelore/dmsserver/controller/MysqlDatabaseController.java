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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/mysql/databases")
public class MysqlDatabaseController {
    
    @Autowired
    private MysqlDatabaseService mysqlDatabaseService;
    
    @Autowired
    private MysqlInstanceService mysqlInstanceService;
    
    /**
     * 获取所有MySQL数据库
     */
    @PostMapping("/list")
    public ApiResponse<List<MysqlDatabaseDTO>> getAllDatabases() {
        List<MysqlDatabaseDTO> databases = mysqlDatabaseService.getAllDatabaseDTOs();
        return ApiResponse.success(databases);
    }
    
    /**
     * 根据ID获取MySQL数据库
     */
    @PostMapping("/get")
    public ApiResponse<MysqlDatabaseDTO> getDatabaseById(@RequestBody IdRequestDTO request) {
        MysqlDatabaseDTO database = mysqlDatabaseService.getDatabaseDTOById(request.getId());
        return ApiResponse.success(database);
    }
    
    /**
     * 根据实例ID获取MySQL数据库列表
     */
    @PostMapping("/listByInstanceId")
    public ApiResponse<List<MysqlDatabaseDTO>> getDatabasesByInstanceId(@RequestBody InstanceIdRequestDTO request) {
        // 根据实例ID获取实例信息，然后获取其主机地址
        MysqlInstance instance = mysqlInstanceService.getById(request.getInstanceId());
        if (instance == null) {
            return ApiResponse.error("找不到对应的MySQL实例");
        }
        
        List<MysqlDatabaseDTO> databases = mysqlDatabaseService.listDTOsByInstanceHost(instance.getHost());
        return ApiResponse.success(databases);
    }
    
    /**
     * 创建MySQL数据库
     */
    @PostMapping("/create")
    public ApiResponse<MysqlDatabaseDTO> createDatabase(@RequestBody MysqlDatabaseDTO databaseDTO) {
        try {
            // 获取实例信息
            MysqlInstance instance = mysqlInstanceService.getByHost(databaseDTO.getInstanceHost());
            
            if (instance == null) {
                return ApiResponse.error("找不到对应的MySQL实例");
            }
            
            // 调用Service层方法创建数据库
            MysqlDatabase database = mysqlDatabaseService.createDatabase(databaseDTO, instance);
            return ApiResponse.success("数据库创建成功", mysqlDatabaseService.getDatabaseDTOById(database.getId()));
        } catch (SQLException e) {
            return ApiResponse.error("数据库操作失败: " + e.getMessage());
        } catch (RuntimeException e) {
            return ApiResponse.error(e.getMessage());
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
        return ApiResponse.success("更新成功", mysqlDatabaseService.getDatabaseDTOById(database.getId()));
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