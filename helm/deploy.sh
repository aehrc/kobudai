#!/bin/bash

DB_PASSWORD=${DB_PASSWORD:thisisapassword}
KUBECONFIG=${KUBECONFIG:-~/.kube/config}
SNAPAGOGO_API_IMAGE_TAG=${SNAPAGOGO_API_IMAGE_TAG:-latest}
SNAPAGOGO_UI_IMAGE_TAG=${SNAPAGOGO_UI_IMAGE_TAG:-latest}
HELM_LOCATION=${HELM_LOCATION:-.}

helm upgrade --install --kubeconfig ${KUBECONFIG} --namespace snapagogo \
  --set snapagogo.api.image="nctsacr.azurecr.io/snapagogo-api:${SNAPAGOGO_API_IMAGE_TAG}" \
  --set snapagogo.ui.image="nctsacr.azurecr.io/snapagogo-ui:${SNAPAGOGO_UI_IMAGE_TAG}" \
  --set snapagogo.database.password="${DB_PASSWORD}" \
  --wait --create-namespace snapagogo ${HELM_LOCATION}