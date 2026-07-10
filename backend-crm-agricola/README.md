<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Arquitectura del proyecto

Este backend sigue una **arquitectura hexagonal (ports & adapters)**, organizada por módulos de dominio (`auth`, `usuarios`, `productos`, `pedidos`, `payments`, `chat`, etc.). Cada módulo se divide en tres capas:

- **`domain/`** — entidades y lógica de negocio pura, sin dependencias de frameworks ni de TypeORM.
- **`application/`** — casos de uso (use-cases) que orquestan el dominio y dependen únicamente de _ports_ (interfaces), nunca de implementaciones concretas.
- **`adapters/`** — implementaciones concretas de entrada (`in/http`, controladores) y salida (`out/persistence`, `out/mercado-pago`, etc.).
- **`ports/out/`** — interfaces (contratos) que el dominio/aplicación define y que los adapters implementan.

Esta separación permite que la lógica de negocio no dependa directamente de TypeORM, de Express, ni de ningún proveedor externo (Mercado Pago, etc.) — todo se conecta mediante inyección de dependencias en los `*.module.ts`.

### Repository Pattern

Cada entidad principal (productos, pedidos, usuarios, pagos, perfiles de productor) define un **port** con la interfaz de persistencia que necesita el dominio, y un **adapter** que la implementa usando TypeORM. Los use-cases dependen solo del port.

**Ejemplo — módulo de productos:**

```typescript
// ports/out/producto-repository.port.ts
export interface ProductoRepositoryPort {
  findById(id: string): Promise<Producto | null>
  searchByNombre(nombre: string): Promise<Producto[]>
  reservarStock(id: string, quantity: number): Promise<boolean>
  // ...
}

// adapters/out/persistence/typeorm/repositories/typeorm-producto.repository.ts
@Injectable()
export class TypeormProductoRepository implements ProductoRepositoryPort {
  constructor(
    @InjectRepository(ProductoEntity)
    private readonly repo: Repository<ProductoEntity>
  ) {}
  // implementación con QueryBuilder parametrizado
}
```

El mismo patrón se repite en `pedidos` (`PedidoRepositoryPort` / `TypeormPedidoRepository`), `usuarios`, `pagos` y `chat`. Gracias a esto, la lógica de negocio en los use-cases nunca importa `Repository<Entity>` de TypeORM directamente — solo el símbolo del port vía `@Inject(PRODUCTO_REPOSITORY_PORT)`.

### Strategy Pattern

El cálculo de comisiones sobre pagos usa Strategy Pattern para desacoplar el algoritmo de cálculo de comisión de la lógica que crea un pago.

**Interfaz (`domain/strategies/comision.strategy.ts`):**

```typescript
export const COMISION_STRATEGY = Symbol('COMISION_STRATEGY')

export interface ComisionStrategy {
  calcular(subtotal: number): number
}
```

**Implementación concreta (`domain/strategies/comision-porcentaje-fijo.strategy.ts`):**

```typescript
export class ComisionPorcentajeFijoStrategy implements ComisionStrategy {
  constructor(private readonly porcentaje: number) {
    /* ... */
  }
  calcular(subtotal: number): number {
    /* ... */
  }
}
```

**Consumidor (`domain/services/pago.factory.ts`):** depende únicamente de la interfaz, nunca de la implementación concreta:

```typescript
export class PagoFactory {
  constructor(private readonly comisionStrategy: ComisionStrategy) {}

  crear(input: CrearPagoInput): Pago {
    const comision = this.comisionStrategy.calcular(input.subtotal)
    // ...
  }
}
```

**Resolución en el módulo (`pagos-comisiones.module.ts`):** la estrategia concreta se decide en un único punto mediante un factory provider, configurable por variable de entorno:

```typescript
{
  provide: COMISION_STRATEGY,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ComisionStrategy => {
    const porcentaje = Number(configService.get<string>('PAYMENT_PLATFORM_COMMISSION_PERCENTAGE'))
    return new ComisionPorcentajeFijoStrategy(porcentaje)
  },
}
```

Esto permite agregar nuevas estrategias de comisión (por ejemplo, escalonada por volumen o diferenciada por categoría de producto) creando una nueva clase que implemente `ComisionStrategy`, sin modificar `PagoFactory` ni ningún use-case que la consuma.

### Convenciones adicionales

- **Controladores delgados**: los controladores (`*.controller.ts`) solo mapean request → DTO → use-case → response. Nunca contienen reglas de negocio, validaciones complejas ni acceso directo a la base de datos.
- **Comunicación exclusivamente JSON**: todos los endpoints consumen y producen `application/json`. El frontend (React + Vite) se comunica con el backend únicamente vía `fetch`/JSON, sin XML ni form-data.
- **Códigos de estado HTTP**: se usan de forma consistente en toda la API:
  - `200 OK` — operaciones de lectura o actualización exitosas.
  - `201 Created` — creación de recursos (pedidos, productos, conversaciones, etc.).
  - `400 Bad Request` — validación de DTO fallida (`class-validator`).
  - `401 Unauthorized` — falta de autenticación (JWT ausente o inválido).
  - `403 Forbidden` — autenticado pero sin permiso sobre el recurso (BOLA prevention).
  - `404 Not Found` — recurso inexistente.
  - `500 Internal Server Error` — manejado por el filtro de excepciones global de NestJS para errores no controlados.
