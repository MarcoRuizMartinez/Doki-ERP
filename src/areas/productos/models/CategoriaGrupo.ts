export interface ICategoriaGrupo {
  id                  : number
  nombre              : string
  codigo              : string
}

export class CategoriaGrupo implements ICategoriaGrupo
{
  id                  : number = 0
  nombre              : string = ""
  codigo              : string = ""

  get label() : string  { return this.nombre  }
  get value() : number  { return this.id      }
}