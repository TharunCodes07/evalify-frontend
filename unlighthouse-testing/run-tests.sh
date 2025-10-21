#!/bin/bash
# Run Unlighthouse tests for DevLabs application
# Usage: ./run-tests.sh [role] [--static]
# Roles: admin, manager, staff, student, all

set -e

# Default credentials (change these if needed)
declare -A CREDENTIALS=(
    ["admin"]="admin:1234"
    ["manager"]="manager:1234"
    ["staff"]="staff:1234"
    ["student"]="student:1234"
)

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run test for a specific role
run_test() {
    local role=$1
    local static_flag=$2
    
    if [[ -z "${CREDENTIALS[$role]}" ]]; then
        echo -e "${RED}Error: Unknown role '$role'${NC}"
        echo "Available roles: admin, manager, staff, student"
        exit 1
    fi
    
    IFS=':' read -r username password <<< "${CREDENTIALS[$role]}"
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Running Unlighthouse for role: $role${NC}"
    echo -e "${GREEN}Username: $username${NC}"
    echo -e "${GREEN}========================================${NC}"
    
    # Set environment variables and run
    export ROLE="$role"
    export KC_USERNAME="$username"
    export KC_PASSWORD="$password"
    
    # Change to the unlighthouse-testing directory
    cd "$(dirname "$0")"
    
    if [[ "$static_flag" == "--static" ]]; then
        echo -e "${YELLOW}Generating static report...${NC}"
        npx unlighthouse --config-file ./unlighthouse.config.mjs --build-static
        
        # Move the report to a role-specific folder
        if [ -d "./.unlighthouse" ]; then
            mkdir -p "./reports"
            rm -rf "./reports/$role"
            mv "./.unlighthouse" "./reports/$role"
            echo -e "${GREEN}Report saved to: ./reports/$role${NC}"
        fi
    else
        npx unlighthouse --config-file ./unlighthouse.config.mjs
    fi
    
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Completed test for role: $role${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
}

# Main script
if [[ $# -eq 0 ]]; then
    echo "Usage: $0 [role] [--static]"
    echo "Roles: admin, manager, staff, student, all"
    echo ""
    echo "Examples:"
    echo "  $0 admin              # Run interactive audit for admin"
    echo "  $0 manager --static   # Generate static report for manager"
    echo "  $0 all                # Run audits for all roles"
    echo "  $0 all --static       # Generate static reports for all roles"
    exit 1
fi

ROLE_ARG=$1
STATIC_FLAG=$2

if [[ "$ROLE_ARG" == "all" ]]; then
    echo -e "${YELLOW}Running tests for all roles...${NC}"
    for role in admin manager staff student; do
        run_test "$role" "$STATIC_FLAG"
        echo ""
        sleep 2  # Brief pause between tests
    done
    echo -e "${GREEN}All tests completed!${NC}"
else
    run_test "$ROLE_ARG" "$STATIC_FLAG"
fi
