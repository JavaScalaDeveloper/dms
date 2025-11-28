package com.arelore.dmsserver.entity;

import com.baomidou.mybatisplus.annotation.TableName;

@TableName("schema_design_work_order")
public class SchemaDesignWorkOrder extends BaseEntity {

    /**
     * 项目名称
     */
    private String projectName;

    /**
     * 数据库类型
     */
    private String databaseType;

    /**
     * 变更基准库
     */
    private String changeBaseline;

    /**
     * 变更相关人
     */
    private String relatedPerson;

    /**
     * 项目背景
     */
    private String projectBackground;

    /**
     * 工单状态
     */
    private String status;

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getDatabaseType() {
        return databaseType;
    }

    public void setDatabaseType(String databaseType) {
        this.databaseType = databaseType;
    }

    public String getChangeBaseline() {
        return changeBaseline;
    }

    public void setChangeBaseline(String changeBaseline) {
        this.changeBaseline = changeBaseline;
    }

    public String getRelatedPerson() {
        return relatedPerson;
    }

    public void setRelatedPerson(String relatedPerson) {
        this.relatedPerson = relatedPerson;
    }

    public String getProjectBackground() {
        return projectBackground;
    }

    public void setProjectBackground(String projectBackground) {
        this.projectBackground = projectBackground;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

