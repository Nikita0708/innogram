import winston from 'winston';

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, service, stack }) => {
    const base = `[${timestamp}] [${service}] ${level}: ${message}`;
    return stack ? `${base}\n${stack}` : base;
  }),
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

export function createLogger(service: string): winston.Logger {
  const isDev = process.env.NODE_ENV !== 'production';

  return winston.createLogger({
    level: isDev ? 'debug' : 'info',
    defaultMeta: { service },
    format: isDev ? devFormat : prodFormat,
    transports: [new winston.transports.Console()],
  });
}
