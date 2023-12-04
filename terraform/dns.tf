resource "azurerm_dns_zone" "snapagogo" {
    name           = var.snapagogo_dns
    resource_group = azurerm_resource_group.onto.name
}

resource "azurerm_dns_cname_record" "snapagogo_ui" {
  name                = var.snapagogo.ui.dns
  zone_name           = azurerm_dns_zone.onto.name
  resource_group_name = azurerm_resource_group.onto.name
  ttl                 = 300
  record              = var.snapagogo.ui.dns
}

resource "azurerm_dns_cname_record" "snapagogo_api" {
  name                = var.snapagogo.api.dns
  zone_name           = azurerm_dns_zone.onto.name
  resource_group_name = azurerm_resource_group.onto.name
  ttl                 = 300
  record              = var.snapagogo.api.dns
}