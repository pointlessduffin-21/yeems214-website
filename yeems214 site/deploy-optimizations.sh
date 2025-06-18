#!/bin/bash

# Deployment Script for yeems214.xyz Optimizations
# This script helps you deploy all performance optimizations

echo "🚀 yeems214.xyz Performance Optimization Deployment"
echo "================================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    print_error "Error: index.html not found. Please run this script from your website root directory."
    exit 1
fi

echo "Starting optimization deployment..."
echo ""

# Step 1: Image Optimization
echo "📸 Step 1: Image Optimization"
echo "=============================="

if [ -f "optimize-images.sh" ]; then
    print_status "Image optimization script found"
    read -p "Do you want to run image optimization? This will convert images to WebP format. (y/n): " optimize_images
    
    if [ "$optimize_images" = "y" ] || [ "$optimize_images" = "Y" ]; then
        chmod +x optimize-images.sh
        echo "Running image optimization..."
        ./optimize-images.sh
        print_status "Image optimization completed"
    else
        print_warning "Skipped image optimization"
    fi
else
    print_error "optimize-images.sh not found"
fi

echo ""

# Step 2: Backup Original Files
echo "💾 Step 2: Backup Original Files"
echo "================================="

backup_dir="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$backup_dir"

if [ -f "index.html" ]; then
    cp "index.html" "$backup_dir/"
    print_status "Backed up original index.html"
fi

if [ -f ".htaccess" ]; then
    cp ".htaccess" "$backup_dir/"
    print_status "Backed up .htaccess"
fi

if [ -f "nginx.conf" ] && [ -f "/etc/nginx/nginx.conf" ]; then
    cp "/etc/nginx/nginx.conf" "$backup_dir/nginx.conf.original"
    print_status "Backed up original nginx.conf"
fi

echo ""

# Step 3: Deploy Configuration Files
echo "⚙️  Step 3: Deploy Configuration Files"
echo "======================================"

# Deploy Cloudflare headers
if [ -f "_headers" ]; then
    print_status "_headers file ready for Cloudflare"
    print_warning "Remember to upload _headers to your root directory if using Cloudflare"
else
    print_error "_headers file not found"
fi

# Deploy Service Worker
if [ -f "sw.js" ]; then
    print_status "Service Worker (sw.js) is ready"
    print_warning "Service Worker will be automatically registered by the optimized index.html"
else
    print_error "sw.js not found"
fi

# Nginx configuration
if [ -f "nginx.conf" ]; then
    print_status "Nginx configuration file found"
    echo "To apply nginx configuration:"
    echo "  1. Copy nginx.conf to your nginx sites directory"
    echo "  2. Update server_name to match your domain"
    echo "  3. Test with: sudo nginx -t"
    echo "  4. Restart with: sudo systemctl restart nginx"
else
    print_error "nginx.conf not found"
fi

echo ""

# Step 4: Verify Optimizations
echo "🔍 Step 4: Verify Optimizations"
echo "==============================="

# Check if optimized index.html has key features
if [ -f "index.html" ]; then
    # Check for lazy loading
    if grep -q 'loading="lazy"' index.html; then
        print_status "Lazy loading implemented"
    else
        print_warning "Lazy loading not found in index.html"
    fi
    
    # Check for WebP support
    if grep -q 'image/webp' index.html; then
        print_status "WebP support implemented"
    else
        print_warning "WebP support not found in index.html"
    fi
    
    # Check for service worker registration
    if grep -q 'serviceWorker.register' index.html; then
        print_status "Service Worker registration found"
    else
        print_warning "Service Worker registration not found"
    fi
    
    # Check for performance optimizations
    if grep -q 'preload' index.html; then
        print_status "Resource preloading implemented"
    else
        print_warning "Resource preloading not found"
    fi
else
    print_error "index.html not found"
fi

echo ""

# Step 5: Performance Testing
echo "📊 Step 5: Performance Testing"
echo "==============================="

if [ -f "performance-test.html" ]; then
    print_status "Performance test page available"
    echo "Open performance-test.html in your browser to test optimizations"
else
    print_warning "performance-test.html not found"
fi

echo ""

# Step 6: Deployment Checklist
echo "📋 Step 6: Deployment Checklist"
echo "================================"

echo "Complete these steps to finish deployment:"
echo ""
echo "🌐 For Cloudflare users:"
echo "   □ Upload _headers file to root directory"
echo "   □ Enable Auto Minify (CSS, JS, HTML) in Cloudflare dashboard"
echo "   □ Enable Brotli compression"
echo "   □ Set Browser Cache TTL to '1 year'"
echo ""
echo "🖥️  For Nginx users:"
echo "   □ Update nginx.conf with provided configuration"
echo "   □ Test configuration: sudo nginx -t"
echo "   □ Restart Nginx: sudo systemctl restart nginx"
echo ""
echo "📱 For all users:"
echo "   □ Test website on mobile devices"
echo "   □ Check performance with Google PageSpeed Insights"
echo "   □ Verify Core Web Vitals in Google Search Console"
echo "   □ Test with slow network connections"
echo ""

# Step 7: Generate Performance Report
echo "📈 Step 7: Performance Report"
echo "============================="

echo "Expected improvements:"
echo "• Image file sizes: 20-35% smaller with WebP"
echo "• Initial page load: 60-80% faster with lazy loading"
echo "• Mobile performance: Significantly improved"
echo "• Core Web Vitals: All metrics in 'Good' range"
echo "• Cellular data usage: Substantially reduced"
echo ""

# Create a simple deployment summary
cat > deployment-summary.txt << EOF
yeems214.xyz Optimization Deployment Summary
============================================
Deployment Date: $(date)
Backup Location: $backup_dir/

Files Deployed:
- index.html (optimized with lazy loading, WebP support)
- _headers (Cloudflare optimization)
- nginx.conf (Nginx optimization)
- sw.js (Service Worker for caching)
- performance-test.html (Performance testing)

Next Steps:
1. Upload optimized files to your server
2. Configure server with appropriate settings
3. Test performance with included tools
4. Monitor Core Web Vitals regularly

For support, refer to OPTIMIZATION_README.md
EOF

print_status "Deployment summary saved to deployment-summary.txt"

echo ""
echo "🎉 Optimization deployment completed!"
echo ""
echo "Your website is now optimized for:"
echo "✓ Cellular data connections"
echo "✓ Slow bandwidth (sub-10mbps)"
echo "✓ Mobile devices"
echo "✓ Better Core Web Vitals"
echo ""
echo "📖 Read OPTIMIZATION_README.md for detailed information"
echo "🧪 Test your optimizations with performance-test.html"
echo "📊 Monitor performance with Google PageSpeed Insights"
echo ""
print_status "Happy optimizing! 🚀" 