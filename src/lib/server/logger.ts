type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    userId?: string;
    email?: string;
    path?: string;
    method?: string;
    error?: Error | unknown;
    [key: string]: any;
}

function formatError(error: Error | unknown): string {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}\n${error.stack || ''}`;
    }
    return String(error);
}

function formatContext(context: LogContext): string {
    const { error, ...rest } = context;
    const contextStr = Object.entries(rest)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}=${value}`)
        .join(' ');
    
    if (error) {
        return `${contextStr}\n${formatError(error)}`;
    }
    return contextStr;
}

function logToConsole(level: LogLevel, message: string, context: LogContext = {}) {
    const timestamp = new Date().toISOString();
    const formattedContext = formatContext(context);
    const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}${formattedContext ? `\n${formattedContext}` : ''}`;

    switch (level) {
        case 'debug':
            console.debug(logMessage);
            break;
        case 'info':
            console.info(logMessage);
            break;
        case 'warn':
            console.warn(logMessage);
            break;
        case 'error':
            console.error(logMessage);
            break;
    }
}

export const logger = {
    debug: (message: string, context?: LogContext) => logToConsole('debug', message, context),
    info: (message: string, context?: LogContext) => logToConsole('info', message, context),
    warn: (message: string, context?: LogContext) => logToConsole('warn', message, context),
    error: (message: string, context?: LogContext) => logToConsole('error', message, context)
};
