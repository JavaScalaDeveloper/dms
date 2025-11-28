package com.arelore.dmsserver.service.impl;

import com.arelore.dmsserver.entity.MysqlDatabase;
import com.arelore.dmsserver.mapper.MysqlDatabaseMapper;
import com.arelore.dmsserver.service.MysqlDatabaseService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class MysqlDatabaseServiceImpl extends ServiceImpl<MysqlDatabaseMapper, MysqlDatabase> implements MysqlDatabaseService {
}