#!/bin/bash
set -euo pipefail

PROJECT_DIR="/opt/pks/frontend"
NGINX_CONFIG="/etc/nginx/sites-available/parkincare"
HEALTH_CHECK_URL="http://127.0.0.1"

cd $PROJECT_DIR

# 현재 활성 환경 감지
get_active_env() {
    if sudo nginx -T 2>/dev/null | grep -q "server 127.0.0.1:3001"; then
        echo "blue"
    elif sudo nginx -T 2>/dev/null | grep -q "server 127.0.0.1:3002"; then
        echo "green"
    else
        echo "none"
    fi
}

# 환경 전환
switch_environment() {
    local target_env=$1
    local target_port=$2
    
    echo "🔄 Switching to $target_env environment (port $target_port)..."
    
    # nginx upstream 변경
    sudo sed -i "s/server 127.0.0.1:300[12];/server 127.0.0.1:$target_port;/" $NGINX_CONFIG
    
    # nginx 설정 검증 및 리로드
    if sudo nginx -t; then
        sudo systemctl reload nginx
        echo "✅ Traffic switched to $target_env environment"
        return 0
    else
        echo "❌ Nginx config test failed"
        return 1
    fi
}

# 헬스체크
health_check() {
    local port=$1
    local max_attempts=30
    local attempt=1
    
    echo "🏥 Health checking port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -sf "$HEALTH_CHECK_URL:$port" > /dev/null 2>&1; then
            echo "✅ Health check passed on port $port (attempt $attempt)"
            return 0
        fi
        echo "⏳ Attempt $attempt/$max_attempts failed, retrying in 2s..."
        sleep 2
        ((attempt++))
    done
    
    echo "❌ Health check failed on port $port after $max_attempts attempts"
    return 1
}

# 메인 배포 로직
main() {
    echo "🚀 Starting Blue-Green Deployment..."
    echo "📅 $(date)"
    
    # 현재 활성 환경 확인
    CURRENT_ENV=$(get_active_env)
    
    if [ "$CURRENT_ENV" = "blue" ]; then
        TARGET_ENV="green"
        TARGET_PORT="3002"
        TARGET_CONTAINER="frontend-green"
        OLD_CONTAINER="frontend-blue"
    elif [ "$CURRENT_ENV" = "green" ]; then
        TARGET_ENV="blue"  
        TARGET_PORT="3001"
        TARGET_CONTAINER="frontend-blue"
        OLD_CONTAINER="frontend-green"
    else
        # 첫 배포시 - blue로 시작
        TARGET_ENV="blue"
        TARGET_PORT="3001"
        TARGET_CONTAINER="frontend-blue"
        OLD_CONTAINER=""
    fi
    
    echo "📍 Current active: $CURRENT_ENV"
    echo "🎯 Deploying to: $TARGET_ENV (port $TARGET_PORT)"
    
    # 타겟 환경에 새 버전 배포
    echo "🔨 Building and starting $TARGET_CONTAINER..."
    docker compose up -d --build $TARGET_CONTAINER
    
    # 컨테이너 시작 대기
    sleep 5
    
    # 헬스체크
    if ! health_check $TARGET_PORT; then
        echo "❌ Deployment failed - health check failed"
        echo "🧹 Cleaning up failed deployment..."
        docker compose stop $TARGET_CONTAINER 2>/dev/null || true
        exit 1
    fi
    
    # 트래픽 전환
    if ! switch_environment $TARGET_ENV $TARGET_PORT; then
        echo "❌ Traffic switch failed"
        echo "🧹 Cleaning up failed deployment..."
        docker compose stop $TARGET_CONTAINER 2>/dev/null || true
        exit 1
    fi
    
    # 웹사이트 최종 확인
    echo "🌐 Final website check..."
    if curl -sf https://parkincare.com > /dev/null 2>&1; then
        echo "✅ Website is responding correctly"
    else
        echo "⚠️  Website check failed, but deployment completed"
    fi
    
    # 이전 환경 정리 (10초 대기 후)
    if [ -n "$OLD_CONTAINER" ]; then
        echo "⏳ Waiting 10 seconds before cleaning up old environment..."
        sleep 10
        echo "🧹 Stopping old container: $OLD_CONTAINER"
        docker compose stop $OLD_CONTAINER 2>/dev/null || true
    fi
    
    # 사용하지 않는 이미지 정리
    docker image prune -f
    
    echo ""
    echo "🎉 Blue-Green deployment completed successfully!"
    echo "📊 Active environment: $TARGET_ENV (port $TARGET_PORT)"
    echo "🕒 Completed at: $(date)"
}

# 스크립트 실행
main "$@"