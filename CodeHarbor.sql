CREATE TABLE "users" (
  "id" integer PRIMARY KEY,
  "username" varchar,
  "password" varchar,
  "role" varchar,
  "created_at" timestamp,
  "estate" varchar
);

CREATE TABLE "colaboradores" (
  "id" integer PRIMARY KEY,
  "tipo_identificacion" varchar,
  "numero_identificacion" integer UNIQUE,
  "nombre" varchar,
  "apellido" varchar,
  "fecha_nacimiento" date,
  "estado_civil" varchar,
  "sexo" varchar,
  "direccion" varchar,
  "telefono" varchar,
  "correo_electronico" varchar UNIQUE,
  "salario" decimal,
  "fecha_ingreso" date,
  "jerarquia" varchar,
  "especialidad" varchar,
  "usuario_id" integer
);

CREATE TABLE "pacientes" (
  "id" integer PRIMARY KEY,
  "tipo_identificacion" varchar,
  "numero_identificacion" integer UNIQUE,
  "nombre" varchar,
  "apellido" varchar,
  "fecha_nacimiento" date,
  "estado_civil" varchar,
  "sexo" varchar,
  "direccion" varchar,
  "telefono" varchar,
  "correo_electronico" varchar UNIQUE,
  "usuario_id" integer
);

CREATE TABLE "medicamentos" (
  "id" integer PRIMARY KEY,
  "denominacion" varchar,
  "proveedor" varchar,
  "lote" varchar,
  "tipo" varchar,
  "cantidad_total" integer,
  "fecha_vencimiento" date,
  "precio_unidad" decimal,
  "grupo" varchar,
  "subgrupo" varchar,
  "alto_costo" boolean,
  "alerta_vencimiento" date
);

CREATE TABLE "formulas_medicas" (
  "id" integer PRIMARY KEY,
  "id_paciente" integer,
  "id_colaborador" integer,
  "fecha_generacion" timestamp,
  "fecha_vencimiento" date
);

CREATE TABLE "medicamentos_recetados" (
  "id" integer PRIMARY KEY,
  "id_formula_medica" integer,
  "medicamento_id" integer,
  "cantidad" integer,
  "prescripcion" text
);

CREATE TABLE "citas_medicas" (
  "id_cita" integer PRIMARY KEY,
  "fecha" date,
  "hora" time,
  "colaborador_id" integer,
  "id_paciente" integer,
  "estado" varchar
);

CREATE TABLE "entrada_pacientes" (
  "id" integer PRIMARY KEY,
  "id_paciente" integer,
  "hora_entrada" timestamp,
  "secretario_id" integer
);

CREATE TABLE "historias_clinicas" (
  "id_Historia" integer PRIMARY KEY,
  "id_Colaborador" integer,
  "id_Paciente" integer,
  "antecedentes_personales" text,
  "ciclo_menstrual" varchar,
  "enfermedades_familiares" text,
  "enfermedades_personales" text,
  "motivo_consulta" text,
  "diagnostico_consulta" text,
  "tratamiento_consulta" text
);

CREATE TABLE "solicitudes" (
  "id" integer PRIMARY KEY,
  "fecha_solicitud" date,
  "id_medicamento_recetado" integer
);

COMMENT ON TABLE "users" IS 'Almacena información de los usuarios del sistema';

COMMENT ON TABLE "colaboradores" IS 'Almacena información de los colaboradores de la clínica';

COMMENT ON TABLE "pacientes" IS 'Almacena información de los pacientes de la clínica';

COMMENT ON TABLE "medicamentos" IS 'Almacena información detallada de los medicamentos disponibles en la clínica, incluyendo si son de alto costo';

COMMENT ON TABLE "formulas_medicas" IS 'Almacena información de las fórmulas médicas';

COMMENT ON TABLE "medicamentos_recetados" IS 'Tabla de unión para relacionar fórmulas médicas con medicamentos';

COMMENT ON TABLE "citas_medicas" IS 'Almacena información de las citas médicas';

COMMENT ON TABLE "entrada_pacientes" IS 'Almacena información de la entrada de pacientes a la clínica';

COMMENT ON TABLE "historias_clinicas" IS 'Contiene la información detallada de la historia clínica de cada paciente, incluyendo antecedentes, diagnósticos y tratamientos';

COMMENT ON TABLE "solicitudes" IS 'Almacena información sobre las solicitudes de medicamentos de alto costo';

ALTER TABLE "solicitudes" ADD FOREIGN KEY ("id_medicamento_recetado") REFERENCES "medicamentos_recetados" ("id");

ALTER TABLE "historias_clinicas" ADD FOREIGN KEY ("id_Paciente") REFERENCES "pacientes" ("id");

ALTER TABLE "historias_clinicas" ADD FOREIGN KEY ("id_Colaborador") REFERENCES "colaboradores" ("id");

ALTER TABLE "colaboradores" ADD FOREIGN KEY ("usuario_id") REFERENCES "users" ("id");

ALTER TABLE "pacientes" ADD FOREIGN KEY ("usuario_id") REFERENCES "users" ("id");

ALTER TABLE "medicamentos_recetados" ADD FOREIGN KEY ("id_formula_medica") REFERENCES "formulas_medicas" ("id");

ALTER TABLE "medicamentos_recetados" ADD FOREIGN KEY ("medicamento_id") REFERENCES "medicamentos" ("id");

ALTER TABLE "formulas_medicas" ADD FOREIGN KEY ("id_paciente") REFERENCES "pacientes" ("id");

ALTER TABLE "formulas_medicas" ADD FOREIGN KEY ("id_colaborador") REFERENCES "colaboradores" ("id");

ALTER TABLE "citas_medicas" ADD FOREIGN KEY ("colaborador_id") REFERENCES "colaboradores" ("id");

ALTER TABLE "citas_medicas" ADD FOREIGN KEY ("id_paciente") REFERENCES "pacientes" ("id");

ALTER TABLE "entrada_pacientes" ADD FOREIGN KEY ("id_paciente") REFERENCES "pacientes" ("id");

ALTER TABLE "entrada_pacientes" ADD FOREIGN KEY ("secretario_id") REFERENCES "colaboradores" ("id");
