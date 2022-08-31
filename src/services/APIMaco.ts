export function getURL( tipo: "servicios" | "listas" | "informes",  modulo : string  )
{
  return process.env.URL_DOLIBARR + "/_maco/webservices/" + tipo + "/" + modulo + ".php"
} 

export function getFormData( tipo: string, miAppend : object ) : FormData
{
  const miFormData    = new FormData()
  
  if(miAppend.hasOwnProperty("tipo"))
  {
    console.error("Error: función getFormData no puede contener una key con el nombre tipo")
    return miFormData
  }

  miFormData.append("tipo", tipo)        

  let   jsonRaw       = JSON.stringify  ( miAppend  )
  let   json          = JSON.parse      ( jsonRaw   )

  for( let key in json) {
    miFormData.append(key, json[key]);
  }

  return miFormData
}

/* 
export function useAPIMaco() 
{




  return {
    getFormData,
    getURL,
  }
} */