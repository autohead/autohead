from rest_framework.response import Response

def custom_response(data=None, method='GET', data_name='data', status=200):
    # If data is a paginated queryset
    paginated = False
    paginated_data = {}
    if isinstance(data, dict) and 'results' in data:
        paginated = True
        paginated_data = {
            'count': data['count'],
            'next': data['next'],
            'previous': data['previous'],
            'results': data['results'],
            'current_page': data['current_page']
        }
        data_to_send = paginated_data
    else:
        data_to_send = data

    messages = {
        'GET': f'{data_name} fetched successfully',
        'GET_BY_ID': f'{data_name} fetched successfully',
        'POST': f'{data_name} created successfully',
        'PUT': f'{data_name} updated successfully',
        'DELETE': f'{data_name} deleted successfully'
    }
    message = messages.get(method, 'Operation successful')

    return Response({
        'success': True,
        'message': message,
        'data': data_to_send
    }, status=status)
