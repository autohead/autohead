from rest_framework.response import Response

def custom_response(data=None, method='GET', data_name='data', status=200):

    messages = {
        'GET': f'{data_name} fetched successfully',
        'GET_BY_ID': f'{data_name} fetched successfully',
        'POST': f'{data_name} created successfully',
        'PUT': f'{data_name} updated successfully',
        'DELETE': f'{data_name} deleted successfully',
        'REACTIVATE': f'{data_name} reactivated successfully',
        'DEACTIVATE': f'{data_name} deactivated successfully',
    }
    message = messages.get(method, 'Operation successful')

    return Response({
        'success': True,
        'message': message,
        'data': data
    }, status=status)
