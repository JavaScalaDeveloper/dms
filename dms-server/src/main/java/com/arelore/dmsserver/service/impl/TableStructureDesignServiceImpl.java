package com.arelore.dmsserver.service.impl;

import com.arelore.dmsserver.entity.TableStructureDesign;
import com.arelore.dmsserver.mapper.TableStructureDesignMapper;
import com.arelore.dmsserver.service.TableStructureDesignService;
import com.arelore.dmsserver.dto.TableStructureDesignDTO;
import com.arelore.dmsserver.util.DTOUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableStructureDesignServiceImpl extends ServiceImpl<TableStructureDesignMapper, TableStructureDesign> implements TableStructureDesignService {
    
    @Override
    public TableStructureDesign saveTableStructureDesign(TableStructureDesignDTO tableStructureDesignDTO) {
        TableStructureDesign tableStructureDesign = DTOUtil.toEntity(tableStructureDesignDTO);
        
        // 根据工单ID和表名判断记录是否存在
        TableStructureDesign existingRecord = this.lambdaQuery()
                .eq(TableStructureDesign::getWorkOrderId, tableStructureDesign.getWorkOrderId())
                .eq(TableStructureDesign::getTableName, tableStructureDesign.getTableName())
                .one();
        
        if (existingRecord != null) {
            // 如果记录存在，则更新
            tableStructureDesign.setId(existingRecord.getId());
            // 版本号自增
            tableStructureDesign.setCurrentVersion(existingRecord.getCurrentVersion() + 1);
            this.updateById(tableStructureDesign);
        } else {
            // 如果记录不存在，则新增
            tableStructureDesign.setCurrentVersion(1);
            this.save(tableStructureDesign);
        }
        
        return tableStructureDesign;
    }
    
    @Override
    public TableStructureDesign getByWorkOrderId(Long workOrderId) {
        // 获取该工单下的所有表结构设计，返回最新创建的一个
        return this.lambdaQuery()
                .eq(TableStructureDesign::getWorkOrderId, workOrderId)
                .orderByDesc(TableStructureDesign::getCreateTime)
                .last("LIMIT 1")
                .one();
    }
    
    @Override
    public List<TableStructureDesign> listByWorkOrderId(Long workOrderId) {
        return this.lambdaQuery()
                .eq(TableStructureDesign::getWorkOrderId, workOrderId)
                .list();
    }
    
    @Override
    public List<TableStructureDesignDTO> listDTOsByWorkOrderId(Long workOrderId) {
        List<TableStructureDesign> tableStructureDesigns = this.listByWorkOrderId(workOrderId);
        return tableStructureDesigns.stream().map(DTOUtil::toDTO).collect(Collectors.toList());
    }
    
    @Override
    public TableStructureDesignDTO getTableStructureDesignDTOById(Long id) {
        TableStructureDesign tableStructureDesign = this.getById(id);
        return DTOUtil.toDTO(tableStructureDesign);
    }
}