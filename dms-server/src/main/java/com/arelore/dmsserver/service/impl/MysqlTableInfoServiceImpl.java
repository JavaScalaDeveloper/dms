package com.arelore.dmsserver.service.impl;

import com.arelore.dmsserver.entity.MysqlTableInfo;
import com.arelore.dmsserver.mapper.MysqlTableInfoMapper;
import com.arelore.dmsserver.service.MysqlTableInfoService;
import com.arelore.dmsserver.dto.MysqlTableInfoDTO;
import com.arelore.dmsserver.util.DTOUtil;
import com.arelore.dmsserver.service.MysqlDatabaseService;
import com.arelore.dmsserver.entity.MysqlDatabase;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MysqlTableInfoServiceImpl extends ServiceImpl<MysqlTableInfoMapper, MysqlTableInfo> implements MysqlTableInfoService {
    
    @Autowired
    private MysqlDatabaseService mysqlDatabaseService;
    
    @Override
    public List<MysqlTableInfo> listByDatabaseId(Long databaseId) {
        // 根据数据库ID获取数据库信息
        MysqlDatabase database = mysqlDatabaseService.getById(databaseId);
        if (database == null) {
            return this.list(); // 如果找不到数据库，返回所有表信息
        }
        
        // 根据数据库名称查询表信息
        return this.list(new QueryWrapper<MysqlTableInfo>().eq("db_name", database.getName()));
    }
    
    @Override
    public List<MysqlTableInfoDTO> listDTOsByDatabaseId(Long databaseId) {
        List<MysqlTableInfo> tables = this.listByDatabaseId(databaseId);
        return tables.stream().map(DTOUtil::toDTO).collect(Collectors.toList());
    }
    
    @Override
    public List<MysqlTableInfoDTO> getAllTableInfoDTOs() {
        List<MysqlTableInfo> tables = this.list();
        return tables.stream().map(DTOUtil::toDTO).collect(Collectors.toList());
    }
    
    @Override
    public MysqlTableInfoDTO getTableInfoDTOById(Long id) {
        MysqlTableInfo table = this.getById(id);
        return DTOUtil.toDTO(table);
    }
}