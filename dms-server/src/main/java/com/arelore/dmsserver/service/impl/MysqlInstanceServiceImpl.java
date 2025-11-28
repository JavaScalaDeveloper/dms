package com.arelore.dmsserver.service.impl;

import com.arelore.dmsserver.entity.MysqlInstance;
import com.arelore.dmsserver.mapper.MysqlInstanceMapper;
import com.arelore.dmsserver.service.MysqlInstanceService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class MysqlInstanceServiceImpl extends ServiceImpl<MysqlInstanceMapper, MysqlInstance> implements MysqlInstanceService {
}