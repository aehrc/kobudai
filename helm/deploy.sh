#!/bin/bash

DB_PASSWORD=${DB_PASSWORD:-thisisapassword}
KUBECONFIG=${KUBECONFIG:-~/.kube/config}
SNAPAGOGO_API_IMAGE_TAG=${SNAPAGOGO_API_IMAGE_TAG:-latest}
SNAPAGOGO_UI_IMAGE_TAG=${SNAPAGOGO_UI_IMAGE_TAG:-latest}
HELM_LOCATION=${HELM_LOCATION:-.}

if [ -f "setenv.sh" ]; then
  echo "Using setenv to set variables"
  source setenv.sh
fi

helm upgrade --install --kubeconfig ${KUBECONFIG} --namespace snapagogo \
  --set snapagogo.api.image="ontoserver.azurecr.io/snapagogo-api:${SNAPAGOGO_API_IMAGE_TAG}" \
  --set snapagogo.ui.image="ontoserver.azurecr.io/snapagogo-ui:${SNAPAGOGO_UI_IMAGE_TAG}" \
  --set snapagogo.database.password="${DB_PASSWORD}" \
  --wait --create-namespace snapagogo ${HELM_LOCATION}