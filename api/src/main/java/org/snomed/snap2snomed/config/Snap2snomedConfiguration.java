/*
 * Copyright © 2022 SNOMED International
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.snomed.snap2snomed.config;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.URL;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * Top level configuration class which can be injected in any component for access to the properties
 * passed to the application.
 * 
 * When adding new properties, think about the hierarchy under this class they should be in which
 * will dictate their path as a property. Also consider adding validation annotations which help
 * ensure the system is properly configured on startup to avoid subtle and late detected
 * configuration errors.
 */
@ConfigurationProperties(prefix = "snap2snomed")
@Getter
@Setter
@Validated
public class Snap2snomedConfiguration {

  boolean production = true;

  @NotBlank
  String applicationInstanceName = "Snapagogo";

  @NotBlank
  String applicationInstanceSummary = "A hosted tool for collaboratively creating and maintaining simple maps to FHIR Code Systems.";

  @NotBlank
  String logo = "assets/img/logo.png";

  @NotBlank
  String bannerLogo = "assets/img/aehrc_logo.png";

  @NotBlank
  String defaultLanguage = "en";

  int maximumImportedCodeSetRows = 200000;

  @URL
  String userRegistrationUrl = null;

  String registrationText = "To log in you need an appropriate account.";

  String mainPageText = "";

  @URL
  String userGuideUrl = "http://snomed.org/s2sug";

  @NotBlank
  String provider = "Australian e-Health Research Centre, CSIRO";

  @URL
  String providerUrl = "http://aehrc.csiro.au";
  
  @URL
  String termsOfServiceUrl = "";

  @URL
  String privacyPolicyUrl = "https://www.iubenda.com/privacy-policy/46600952";

  @NotBlank
  String currentTermsVersion = "1";

  @URL
  String feedbackUrl = "";

  @NotEmpty
  String[] targetCodeSystems = { "http://snomed.info/sct", "http://loinc.org" };

  @NotNull
  @Valid
  TerminologyServerConfiguration defaultTerminologyServer;

  @Valid
  SecurityConfiguration security = new SecurityConfiguration();

  // CORS Configuration properties
  @NotNull
  @Valid
  CorsConfigurationProperties cors = new CorsConfigurationProperties();

  // SWagger UI Config
  @NotNull
  @Valid
  SwaggerConfiguration swagger = new SwaggerConfiguration();

  String identityProvider = "";
}
