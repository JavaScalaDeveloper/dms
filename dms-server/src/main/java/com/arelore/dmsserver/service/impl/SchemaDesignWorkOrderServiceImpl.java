package com.arelore.dmsserver.service.impl;

import com.arelore.dmsserver.entity.SchemaDesignWorkOrder;
import com.arelore.dmsserver.mapper.SchemaDesignWorkOrderMapper;
import com.arelore.dmsserver.service.SchemaDesignWorkOrderService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

@Service
public class SchemaDesignWorkOrderServiceImpl extends ServiceImpl<SchemaDesignWorkOrderMapper, SchemaDesignWorkOrder>
        implements SchemaDesignWorkOrderService {
}

