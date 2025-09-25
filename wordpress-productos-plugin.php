<?php
/**
 * Plugin Name: Jardín Infinito - Productos
 * Description: Custom Post Type para productos del jardín
 * Version: 1.0.0
 */

// Evitar acceso directo
if (!defined('ABSPATH')) {
    exit;
}

// Registrar Custom Post Type
function jardin_infinito_register_productos() {
    $labels = array(
        'name'                  => 'Productos',
        'singular_name'         => 'Producto',
        'menu_name'             => 'Productos',
        'add_new_item'          => 'Añadir Nuevo Producto',
        'edit_item'             => 'Editar Producto',
        'new_item'              => 'Nuevo Producto',
        'view_item'             => 'Ver Producto',
        'search_items'          => 'Buscar Productos',
        'not_found'             => 'No se encontraron productos',
        'not_found_in_trash'    => 'No hay productos en la papelera'
    );

    $args = array(
        'labels'                => $labels,
        'public'                => true,
        'publicly_queryable'    => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'show_in_rest'          => true, // Importante para REST API
        'rest_base'             => 'productos',
        'query_var'             => true,
        'rewrite'               => array('slug' => 'producto'),
        'capability_type'       => 'post',
        'has_archive'           => true,
        'hierarchical'          => false,
        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-store',
        'supports'              => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'taxonomies'            => array('category', 'post_tag')
    );

    register_post_type('productos', $args);
}
add_action('init', 'jardin_infinito_register_productos');

// Registrar campos ACF programáticamente
function jardin_infinito_add_acf_fields() {
    if (function_exists('acf_add_local_field_group')) {
        acf_add_local_field_group(array(
            'key' => 'group_productos',
            'title' => 'Información del Producto',
            'fields' => array(
                array(
                    'key' => 'field_precio',
                    'label' => 'Precio',
                    'name' => 'precio',
                    'type' => 'number',
                    'required' => 1,
                ),
                array(
                    'key' => 'field_precio_descuento',
                    'label' => 'Precio con Descuento',
                    'name' => 'precio_descuento',
                    'type' => 'number',
                ),
                array(
                    'key' => 'field_descripcion_corta',
                    'label' => 'Descripción Corta',
                    'name' => 'descripcion_corta',
                    'type' => 'textarea',
                ),
                array(
                    'key' => 'field_categoria',
                    'label' => 'Categoría',
                    'name' => 'categoria',
                    'type' => 'select',
                    'choices' => array(
                        'plantas-interior' => 'Plantas de Interior',
                        'plantas-exterior' => 'Plantas de Exterior',
                        'aromaticas' => 'Plantas Aromáticas',
                        'suculentas' => 'Suculentas',
                        'macetas' => 'Macetas',
                        'herramientas' => 'Herramientas',
                    ),
                ),
                array(
                    'key' => 'field_stock',
                    'label' => 'Stock',
                    'name' => 'stock',
                    'type' => 'number',
                    'default_value' => 0,
                ),
                array(
                    'key' => 'field_destacada',
                    'label' => 'Producto Destacado',
                    'name' => 'destacada',
                    'type' => 'true_false',
                ),
                array(
                    'key' => 'field_imagen_adicional_1',
                    'label' => 'Imagen Adicional 1',
                    'name' => 'imagen_adicional_1',
                    'type' => 'image',
                ),
                array(
                    'key' => 'field_imagen_adicional_2',
                    'label' => 'Imagen Adicional 2',
                    'name' => 'imagen_adicional_2',
                    'type' => 'image',
                ),
            ),
            'location' => array(
                array(
                    array(
                        'param' => 'post_type',
                        'operator' => '==',
                        'value' => 'productos',
                    ),
                ),
            ),
        ));
    }
}
add_action('acf/init', 'jardin_infinito_add_acf_fields');

// Habilitar CORS para la API REST
function jardin_infinito_cors_headers() {
    header("Access-Control-Allow-Origin: https://jardininfinito.com");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
}
add_action('rest_api_init', 'jardin_infinito_cors_headers');

// Agregar campos ACF a la respuesta REST API
function jardin_infinito_add_acf_to_rest($response, $post, $request) {
    if ($post->post_type === 'productos') {
        $acf_fields = get_fields($post->ID);
        if ($acf_fields) {
            $response->data['acf'] = $acf_fields;
        }
    }
    return $response;
}
add_filter('rest_prepare_productos', 'jardin_infinito_add_acf_to_rest', 10, 3);
?>