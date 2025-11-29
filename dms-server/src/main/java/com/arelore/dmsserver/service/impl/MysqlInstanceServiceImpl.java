package com.arelore.dmsserver.service.impl;

import com.arelore.dmsserver.entity.MysqlInstance;
import com.arelore.dmsserver.mapper.MysqlInstanceMapper;
import com.arelore.dmsserver.service.MysqlInstanceService;
import com.arelore.dmsserver.dto.MysqlInstanceDTO;
import com.arelore.dmsserver.util.DTOUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MysqlInstanceServiceImpl extends ServiceImpl<MysqlInstanceMapper, MysqlInstance> implements MysqlInstanceService {
    
    @Override
    public MysqlInstance getByHost(String host) {
        return this.getOne(new QueryWrapper<MysqlInstance>().eq("host", host));
    }
    
    @Override
    public List<MysqlInstanceDTO> getAllInstanceDTOs() {
        List<MysqlInstance> instances = this.list();
        return instances.stream().map(DTOUtil::toDTO).collect(Collectors.toList());
    }
    
    @Override
    public MysqlInstanceDTO getInstanceDTOById(Long id) {
        MysqlInstance instance = this.getById(id);
        return DTOUtil.toDTO(instance);
    }
}