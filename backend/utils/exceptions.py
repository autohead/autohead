# utils/exceptions.py
from rest_framework.views import exception_handler
from rest_framework.response import Response
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        message = ''
        if response.status_code == 404:
            message = 'Resource not found'
        elif response.status_code == 500:
            message = 'Internal server error'
        elif response.status_code == 400:
            message = 'Bad request'
        elif response.status_code == 401:
            message = 'Unauthorized'
        else:
            message = 'something went wrong'

        return Response({
            'success': False,
            'message': message,
            'errors': response.data
        }, status=response.status_code)

    # For unhandled exceptions
    logger.error(str(exc))
    return Response({
        'success': False,
        'message': 'Internal server error',
        'errors': str(exc)
    }, status=500)
