import {  ClientSideRowModelModule, 
          ModuleRegistry
                                    } from "ag-grid-community";
import {  LicenseManager            } from 'ag-grid-enterprise'

export function IniciarAG(){
    LicenseManager.setLicenseKey( "Using_this_{AG_Grid}_Enterprise_key_{AG-060671}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{GRUPO_ESCOM_SAS_-_NIT_900.419.912_7}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{Doki}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{Doki}_need_to_be_licensed___{Doki}_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{24_May_2025}____[v3]_[01]_MTc0ODA0MTIwMDAwMA==81714141f6391012f810023875da8989" )
    ModuleRegistry.registerModules([ ClientSideRowModelModule  ]);
}