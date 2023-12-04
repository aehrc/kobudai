variable "resource_group" {
  description = "Azure resource group where state is located"
  type        = string
}

variable "snapagogo.ui.dns" {
  description = "UI DNS entry name"
  type        = string
  default     = "www"
}
