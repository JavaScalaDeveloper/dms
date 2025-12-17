package com.arelore.dmsserver.dto;

import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
public class MysqlInstanceDTO extends BaseDTO {
    /**
     * 实例名称
     */
    private String name;

    /**
     * 主机地址
     */
    private String host;

    /**
     * 端口号
     */
    private Integer port;

    /**
     * 状态(running:运行中, stopped:已停止)
     */
    private String status;

    /**
     * 环境(prd/pre/test/dev)
     */
    private String env;

    /**
     * 关联测试实例host
     */
    private String relatedTestInstance;

    /**
     * 关联预发实例host
     */
    private String relatedPreInstance;

    /**
     * 关联生产实例host
     */
    private String relatedPrdInstance;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Integer getPort() {
        return port;
    }

    public void setPort(Integer port) {
        this.port = port;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEnv() {
        return env;
    }

    public void setEnv(String env) {
        this.env = env;
    }

    public String getRelatedTestInstance() {
        return relatedTestInstance;
    }

    public void setRelatedTestInstance(String relatedTestInstance) {
        this.relatedTestInstance = relatedTestInstance;
    }

    public String getRelatedPreInstance() {
        return relatedPreInstance;
    }

    public void setRelatedPreInstance(String relatedPreInstance) {
        this.relatedPreInstance = relatedPreInstance;
    }

    public String getRelatedPrdInstance() {
        return relatedPrdInstance;
    }

    public void setRelatedPrdInstance(String relatedPrdInstance) {
        this.relatedPrdInstance = relatedPrdInstance;
    }
}