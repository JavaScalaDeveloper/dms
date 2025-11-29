package com.arelore.dmsserver.service.impl;

import com.arelore.dmsserver.entity.MysqlDatabase;
import com.arelore.dmsserver.mapper.MysqlDatabaseMapper;
import com.arelore.dmsserver.service.MysqlDatabaseService;
import com.arelore.dmsserver.util.DatabaseConnectionUtil;
import com.arelore.dmsserver.entity.MysqlInstance;
import com.arelore.dmsserver.dto.MysqlDatabaseDTO;
import com.arelore.dmsserver.util.DTOUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MysqlDatabaseServiceImpl extends ServiceImpl<MysqlDatabaseMapper, MysqlDatabase> implements MysqlDatabaseService {
    
    @Autowired
    private DatabaseConnectionUtil databaseConnectionUtil;
    
    @Override
    public MysqlDatabase createDatabase(MysqlDatabaseDTO databaseDTO, MysqlInstance instance) throws SQLException {
        // 检查数据库是否已存在于我们的记录中
        List<MysqlDatabase> existingDatabases = this.list(
            new QueryWrapper<MysqlDatabase>()
                .eq("instance_host", databaseDTO.getInstanceHost())
                .eq("name", databaseDTO.getName())
        );
        
        if (!existingDatabases.isEmpty()) {
            throw new RuntimeException("数据库已存在");
        }
        
        // 连接到实例并检查数据库是否真的存在
        try (Connection connection = databaseConnectionUtil.connectToInstance(instance)) {
            if (databaseConnectionUtil.databaseExists(connection, databaseDTO.getName())) {
                // 如果数据库在实际MySQL中存在但在我们的记录中不存在，则只添加记录
                MysqlDatabase database = DTOUtil.toEntity(databaseDTO);
                this.save(database);
                return database;
            } else {
                // 如果数据库在实际MySQL中不存在，则创建它
                databaseConnectionUtil.createDatabase(connection, databaseDTO.getName());
                
                // 保存到我们的记录中
                MysqlDatabase database = DTOUtil.toEntity(databaseDTO);
                this.save(database);
                return database;
            }
        }
    }
    
    @Override
    public List<MysqlDatabase> listByInstanceHost(String instanceHost) {
        return this.list(new QueryWrapper<MysqlDatabase>().eq("instance_host", instanceHost));
    }
    
    @Override
    public List<MysqlDatabaseDTO> listDTOsByInstanceHost(String instanceHost) {
        List<MysqlDatabase> databases = this.listByInstanceHost(instanceHost);
        return databases.stream().map(DTOUtil::toDTO).collect(Collectors.toList());
    }
    
    @Override
    public List<MysqlDatabaseDTO> getAllDatabaseDTOs() {
        List<MysqlDatabase> databases = this.list();
        return databases.stream().map(DTOUtil::toDTO).collect(Collectors.toList());
    }
    
    @Override
    public MysqlDatabaseDTO getDatabaseDTOById(Long id) {
        MysqlDatabase database = this.getById(id);
        return DTOUtil.toDTO(database);
    }
}