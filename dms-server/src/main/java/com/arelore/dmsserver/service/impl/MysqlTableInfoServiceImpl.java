package com.arelore.dmsserver.service.impl;

import com.arelore.dmsserver.entity.MysqlTableInfo;
import com.arelore.dmsserver.mapper.MysqlTableInfoMapper;
import com.arelore.dmsserver.service.MysqlTableInfoService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class MysqlTableInfoServiceImpl extends ServiceImpl<MysqlTableInfoMapper, MysqlTableInfo> implements MysqlTableInfoService {
}