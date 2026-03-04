#!/bin/bash

echo "=== CloudHub/OptScale 一键启动脚本 ==="

# 1. 关闭 swap (k8s 要求)
echo "1. 关闭 swap..."
sudo swapoff -a

# 2. 启动 Docker 和 Kubelet
echo "2. 启动 Docker 和 Kubelet..."
sudo systemctl start docker
sudo systemctl start kubelet

# 3. 等待 Kubernetes API server 就绪
echo "3. 等待 Kubernetes API server 就绪..."
count=0
until kubectl get nodes &>/dev/null; do
    echo -n "."
    sleep 2
    count=$((count+1))
    if [ $count -gt 60 ]; then
        echo -e "\n✗ Kubernetes 启动超时"
        exit 1
    fi
done
echo -e "\n✓ Kubernetes 已就绪"

# 4. 检查并清理 Unknown 状态的 pods
echo "4. 清理异常 pods..."
unknown_pods=$(kubectl get pods --no-headers | grep Unknown | awk '{print $1}')
if [ -n "$unknown_pods" ]; then
    echo "$unknown_pods" | xargs kubectl delete pod --force --grace-period=0 &>/dev/null
    echo "✓ 已清理 Unknown pods"
fi

# 5. 等待关键服务启动
echo "5. 等待关键服务启动..."
services=("rabbitmq-0" "mongo-0" "mariadb-0" "elk-0" "restapi" "auth" "ngui")
for svc in "${services[@]}"; do
    echo -n "  等待 $svc..."
    count=0
    until kubectl get pods | grep "$svc" | grep -q "Running\|1/1"; do
        sleep 3
        count=$((count+1))
        if [ $count -gt 40 ]; then
            echo " 超时"
            break
        fi
    done
    echo " ✓"
done

# 6. 显示服务状态
echo -e "\n6. 服务状态："
kubectl get pods --no-headers | awk '{print $3}' | sort | uniq -c

# 7. 显示访问信息
echo -e "\n=== CloudHub 启动完成 ==="
PUBLIC_IP=$(curl -s ifconfig.me)
echo "访问地址："
echo "  HTTP:  http://$PUBLIC_IP"
echo "  HTTPS: https://$PUBLIC_IP"
echo ""
echo "注意：需要在 AWS 安全组开放端口 80 和 443"
echo ""
echo "查看所有 pods: kubectl get pods"
echo "查看日志: kubectl logs <pod-name>"
